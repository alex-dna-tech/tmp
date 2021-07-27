function importAll(r) {
  r.keys().forEach(r)
}

importAll(require.context('./icons', false, /\.svg$/))
