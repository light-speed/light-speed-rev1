

export default scene => {
  var geometry = new THREE.Geometry();
  for (var i = 0; i < 75000; i++) {
      var vertex = new THREE.Vector3();
      vertex.x = THREE.Math.randFloatSpread(12500);
      vertex.y = THREE.Math.randFloatSpread(12500);
      vertex.z = THREE.Math.randFloatSpread(12500);
      geometry.vertices.push(vertex);
  }
  var particles = new THREE.Points(geometry, new THREE.PointsMaterial({
      color: 0x888888
  }));
  scene.add(particles);
}
