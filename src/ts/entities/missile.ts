import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Missile {
    mesh: THREE.Mesh;
    body: CANNON.Body;
    speed = 50;
    lifetime = 3000;
    spawnTime: number;

    constructor(position: CANNON.Vec3, direction: THREE.Vector3) {
        const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = Math.PI / 2;

        this.body = new CANNON.Body({
            mass: 0.2,
            shape: new CANNON.Cylinder(0.05, 0.05, 1, 8),
            position: position.clone()
        });

        const velocity = direction.clone().multiplyScalar(this.speed);
        this.body.velocity.set(velocity.x, velocity.y, velocity.z);

        this.spawnTime = performance.now();
    }

    update() {
        this.mesh.position.copy(this.body.position as any);
        this.mesh.quaternion.copy(this.body.quaternion as any);

        if (performance.now() - this.spawnTime > this.lifetime) {
            this.destroy();
        }
    }

    destroy() {
        game.scene.remove(this.mesh);
        game.physicsWorld.removeBody(this.body);
        game.activeMissiles = game.activeMissiles.filter(m => m !== this);
    }
}
