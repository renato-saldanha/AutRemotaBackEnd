module.exports = (app) => {
  app
    .route("/autorizacao/:id_usuario")
    .get(app.api.autorizacaoRemota.listarAutorizacoesPendentes);

  app
    .route("/autorizacao/:id_autorizacao&:autorizado")
    .post(app.api.autorizacaoRemota.processarSolicitacao);
};
