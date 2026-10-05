import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { animate, utils } from "animejs";
import { severityClass } from "../lib/air";

/**
 * The landing globe, made honest.
 *
 * It previously rendered three CSS-animated dots labelled "Live signal" that were
 * connected to nothing. Under rule 2 (motion must never imply data that isn't
 * there) that was the worst offender on the site. This renders the actual
 * detection results: real coordinates, real severity colour, real rotation.
 *
 * Motion is data-driven. The globe turns to face the most severe current
 * detection; with no detections it holds still and says so, rather than spinning
 * decoratively to look busy.
 */

const RADIUS = 1;

function latLonToVector(lat, lon, radius = RADIUS) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

const SEVERITY_HEX = {
  "sev-good": 0x2fd48f,
  "sev-moderate": 0xe8cf5a,
  "sev-high": 0xf1a545,
  "sev-critical": 0xff5f58,
  "sev-severe": 0xb96cff,
  "sev-unknown": 0x5c7573,
};

/** Wireframe graticule. Geometry, not decoration - it is the actual coordinate grid.
 *  Dense enough that curvature is legible, and lifted just off the surface so it
 *  does not z-fight with the sphere. */
function buildGraticule() {
  const points = [];
  const r = RADIUS * 1.004;
  for (let lat = -75; lat <= 75; lat += 15) {
    for (let lon = -180; lon < 180; lon += 3) {
      const a = latLonToVector(lat, lon, r);
      const b = latLonToVector(lat, lon + 3, r);
      points.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  for (let lon = -180; lon < 180; lon += 30) {
    for (let lat = -87; lat < 87; lat += 3) {
      const a = latLonToVector(lat, lon, r);
      const b = latLonToVector(lat + 3, lon, r);
      points.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

/** WebGL is checked during render, not in an effect, so no state is set on mount. */
function hasWebGL() {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Globe3D({ hotspots = [], onReady }) {
  const mountRef = useRef(null);
  const apiRef = useRef({});
  const [failed] = useState(() => !hasWebGL());
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return undefined;
    }
    if (!renderer.getContext()) {
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Depth cue: graticule on the far side recedes instead of drawing through
    // the sphere, which is most of what sells the curvature.
    scene.fog = new THREE.Fog(0x04100f, 2.1, 4.4);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 3.15;

    const world = new THREE.Group();
    scene.add(world);

    // Lighting. Without this the sphere is MeshBasicMaterial-flat and reads as a
    // circle, not a globe. Key light + cool fill + rim gives a real terminator.
    scene.add(new THREE.AmbientLight(0x1b4a52, 1.1));
    const keyLight = new THREE.DirectionalLight(0xbdf0f6, 2.1);
    keyLight.position.set(-2.2, 1.5, 2.6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x2ad4f0, 0.9);
    rimLight.position.set(2.6, -1.1, -2.2);
    scene.add(rimLight);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 96, 64),
      // Opaque on purpose: transparency let markers and lines on the FAR side of
      // the globe render straight through the near side, destroying the depth.
      new THREE.MeshPhongMaterial({
        color: 0x07242b,
        emissive: 0x031014,
        specular: 0x1e5560,
        shininess: 14,
        flatShading: false,
      }),
    );
    world.add(globe);

    // Earth, so it reads as Earth rather than as a wireframe ball. Textures are
    // vendored under public/textures (three.js examples, MIT) rather than pulled
    // from a CDN, so the demo works with no network.
    const base = import.meta.env.BASE_URL || "/";
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const maxAniso = renderer.capabilities.getMaxAnisotropy?.() ?? 1;
    const finish = (texture, apply) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, maxAniso);
      apply(texture);
      // Re-compile so the new maps take effect on the already-rendered material.
      globe.material.needsUpdate = true;
    };
    loader.load(
      `${base}textures/earth_atmos_2048.jpg`,
      (texture) => finish(texture, (t) => { globe.material.map = t; }),
      undefined,
      () => {
        // Texture unavailable: the lit sphere still renders, so fail soft.
      },
    );
    loader.load(
      `${base}textures/earth_lights_2048.png`,
      (texture) => finish(texture, (t) => {
        globe.material.emissiveMap = t;
        globe.material.emissive = new THREE.Color(0xffffff);
        globe.material.emissiveIntensity = 0.85;
      }),
      undefined,
      () => {
        // Night lights unavailable: no city glow, but still a real sphere.
      },
    );

    world.add(
      new THREE.LineSegments(
        buildGraticule(),
        new THREE.LineBasicMaterial({
          color: 0x3fb6c8,
          transparent: true,
          opacity: 0.38,
          fog: true,
        }),
      ),
    );

    // Additive back-side shell = a glowing limb, the strongest sphere cue there is.
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.075, 64, 48),
      new THREE.MeshBasicMaterial({
        color: 0x2ad4f0,
        transparent: true,
        opacity: 0.28,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    world.add(atmosphere);

    const markerGroup = new THREE.Group();
    world.add(markerGroup);

    function resize() {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let frame;
    let running = true;
    function loop() {
      if (!running) return;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(loop);
    }
    loop();

    apiRef.current = { scene, world, markerGroup, camera, renderer, dispose: () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      markerGroup.clear();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    } };

    onReady?.(true);
    return () => {
      apiRef.current.dispose?.();
      apiRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- data -> markers -------------------------------------------------------
  useEffect(() => {
    const { markerGroup, world } = apiRef.current;
    if (!markerGroup || !world) return;

    markerGroup.clear();

    const valid = hotspots.filter((h) => Number.isFinite(h?.latitude) && Number.isFinite(h?.longitude));
    if (!valid.length) return;

    const startQuaternion = world.quaternion.clone();
    const targetPoint = latLonToVector(
      valid[0].latitude,
      valid[0].longitude,
    ).normalize();
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      targetPoint,
    );

    valid.forEach((hotspot, index) => {
      const colour = SEVERITY_HEX[severityClass(hotspot.aqi)] ?? SEVERITY_HEX["sev-unknown"];
      const confidence = Math.max(0.2, Math.min(1, hotspot.confidence ?? 0.4));
      const position = latLonToVector(hotspot.latitude, hotspot.longitude, RADIUS * 1.012);

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.032 + confidence * 0.034, 16, 16),
        new THREE.MeshBasicMaterial({ color: colour }),
      );
      dot.position.copy(position);
      dot.lookAt(0, 0, 0);
      markerGroup.add(dot);

      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.085, 0.094, 40),
        new THREE.MeshBasicMaterial({
          color: colour,
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
        }),
      );
      halo.position.copy(position);
      halo.lookAt(0, 0, 0);
      markerGroup.add(halo);

      // Markers land on their real coordinates. Nothing moves unless the value
      // that put it there actually changed, so entry is staggered by severity.
      dot.scale.setScalar(0.001);
      halo.scale.setScalar(0.001);
      animate(dot.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: reduced ? 1 : 620,
        delay: reduced ? 0 : index * 90,
        ease: "outBack(2)",
      });
      animate(halo.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: reduced ? 1 : 760,
        delay: reduced ? 0 : index * 90 + 120,
        ease: "outQuad",
      });

      dot.userData.halo = halo;
    });

    // The turn. Rotation that means something: the globe faces the worst
    // current detection instead of spinning forever.
    if (reduced) {
      world.quaternion.copy(targetQuaternion);
      return;
    }

    const tweenState = { t: 0 };
    animate(tweenState, {
      t: 1,
      duration: 1400,
      ease: "inOutQuart",
      onUpdate: () => {
        world.quaternion.slerpQuaternions(startQuaternion, targetQuaternion, tweenState.t);
      },
    });

    // Idle drift, but only while there is data on screen to justify it.
    // Rotate by the DELTA each frame: applying the absolute angle would compound
    // every frame and spin the globe wildly instead of drifting.
    let drift = null;
    let lastAngle = 0;
    const startDrift = () => {
      if (reduced || drift) return;
      const spin = { angle: 0 };
      drift = animate(spin, {
        angle: Math.PI * 2,
        duration: 180000,
        ease: "linear",
        onUpdate: () => {
          const delta = spin.angle - lastAngle;
          lastAngle = spin.angle;
          world.rotateY(delta);
        },
        onComplete: () => {
          lastAngle = 0;
        },
      });
    };
    const idleTimer = setTimeout(startDrift, 1800);
    const loopTimer = setInterval(startDrift, 60000);

    return () => {
      clearTimeout(idleTimer);
      clearInterval(loopTimer);
      if (drift) {
        utils.remove(drift);
        drift = null;
      }
    };
  }, [hotspots, reduced]);

  if (failed) {
    return (
      <div className="globe-fallback" role="img" aria-label="Live detection globe unavailable">
        <span>live globe unavailable on this device</span>
      </div>
    );
  }

  return <div ref={mountRef} className="globe-canvas" role="img" aria-label="Earth showing live AIRGUARD detections" />;
}