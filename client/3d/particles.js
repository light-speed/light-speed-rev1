

export default scene => {
  var geometry = new THREE.Geometry();
  for (var i = 0; i < 20000; i++) {
      var vertex = new THREE.Vector3();
      vertex.x = THREE.Math.randFloatSpread(20000);
      vertex.y = THREE.Math.randFloatSpread(20000);
      vertex.z = THREE.Math.randFloatSpread(20000);
      geometry.vertices.push(vertex);
  }
  var particles = new THREE.Points(geometry, new THREE.PointsMaterial({
      color: 0x888888
  }));
  scene.add(particles);
}
