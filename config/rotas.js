module.exports = (app) => {
  app
    .route("/autorizacao/:id_usuario")
    .get(app.api.autorizacaoRemota.listarAutorizacoesPendentes);

  app
    .route("/autorizacao/:id_autorizacao&:autorizado")
    .post(app.api.autorizacaoRemota.processarSolicitacao);

  app.route("/login/:id_usuario&:senha").get(app.api.login.login);

  app.route("/usuarios/getUsuarios").get(app.api.usuario.getUsuarios);
};
