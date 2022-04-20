module.exports = (app) => {
  const listarAutorizacoesPendentes = (req, res) => {
    const id_usuario = req.params.id_usuario;

    app
      .db("AUTORIZACOES as A")
      .select(
        "A.ID_AUTORIZACAO, A.DATA, A.ID_PROCESSO, U.ID_USUARIO, U.NOME_USUARIO USUARIO, A.AUTORIZADO"
      )
      .leftJoin("PROCESSOS as P", function () {
        this.on("P.ID_SISTEMA", "'SOLUTION'").andOn(
          "P.ID_PROCESSO",
          "=",
          "A.ID_PROCESSO"
        );
      })
      .leftJoin("PROCESSOS_DIREITOS as PD", function () {
        this.on("PD.ID_SISTEMA", "P.ID_SISTEMA")
          .andOn("PD.ID_PROCESSO", "P.ID_PROCESSO")
          .andOn("PD.ID_DIREITO", "A.ID_DIREITO");
      })
      .leftJoin("USUARIOS as U", function () {
        this.on("U.ID_EMPRESA", "A.ID_EMPRESA")
          .andOn("U.ID_FILIAL", "A.ID_FILIAL")
          .andOn("U.ID_USUARIO", "A.ID_USUARIO");
      })
      .leftJoin("USUARIOS as UGS", function () {
        this.on("UGS.ID_EMPRESA", "A.ID_EMPRESA")
          .andOn("UGS.ID_FILIAL", "A.ID_FILIAL")
          .andOn("UGS.ID_USUARIO", "A.ID_GERENTE_GRUPO")
          .orOn("UGS.ID_USUARIO", "A.ID_SUPERVISOR_GRUPO");
      })
      .leftJoin(
        "GRUPO_USUARIOS as GU",
        "GU.ID_GRUPO_USUARIOS",
        "=",
        "UGS.ID_GRUPO_REFERENCIA"
      )
      .whereNull("A.AUTORIZADO")
      .where("UGS.ID_USUARIO", parseInt(id_usuario))
      .then((a) => res.json(a))
      .catch((err) => res.status(401).json("Houve um erro: " + err));
  };

  const processarSolicitacao = (req, res) => {
    const id_autorizacao = req.params.id_autorizacao;
    const autorizado = req.params.autorizado;

    app
      .db("AUTORIZACOES")
      .where("ID_AUTORIZACAO", parseInt(id_autorizacao))
      .update("AUTORIZADO", parseInt(autorizado))
      .then((_) => res.status(200).send("Solicitação processada!"))
      .catch((err) => res.status(401).json(err));
  };
  return { listarAutorizacoesPendentes, processarSolicitacao };
};
