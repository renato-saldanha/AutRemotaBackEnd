module.exports = (app) => {
  const listarAutorizacoesPendentes = (req, res) => {
    const id_usuario = req.params.id_usuario;

    app
      .db("AUTORIZACOES as A")
      .select(
        `${app.db.raw(colunaOperacao)} F.ID_FILIAL, F.RAZAO_SOCIAL, A.ID_AUTORIZACAO, A.DATA, A.ID_PROCESSO, U.ID_USUARIO, 
        U.NOME_USUARIO USUARIO, A.AUTORIZADO`
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
      .leftJoin("FILIAIS as F", function () {
        this.on("F.ID_EMPRESA", "A.ID_EMPRESA").andOn(
          "F.ID_FILIAL",
          "A.ID_FILIAL"
        );
      })
      .whereNull("A.AUTORIZADO")
      .where("UGS.ID_USUARIO", parseInt(id_usuario))
      .orderBy('A.ID_AUTORIZACAO')
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

  const colunaOperacao = 
  ` CASE WHEN (A.ID_PROCESSO = 'LIB_DESC_TERM')           THEN 'LIB. DE DESCONTO NO TERMINAL'
         WHEN (A.ID_PROCESSO = 'LIB_DESC_PREVEN')         THEN 'LIB. DE DESCONTO NA PREVENDA'
         WHEN (A.ID_PROCESSO = 'LIB_DESC_TIT')            THEN 'LIB. DESC. DE TITULOS'
         WHEN (A.ID_PROCESSO = 'LIB_MULTA_TIT')           THEN 'LIB. MULTA DE TITULOS'
         WHEN (A.ID_PROCESSO = 'LIB_JUROS_TIT')           THEN 'LIB. JUROS DE TITULOS'
         WHEN (A.ID_PROCESSO = 'LIB_VAL_MIN_PARC_PREVEN') THEN 'LIB. VALOR MIN. PARC. PREVENDA'
         WHEN (A.ID_PROCESSO = 'IGNORAR_RECEITA_MED')     THEN 'IGNORAR RECEITA MEDICA'
         ELSE P.DESCRICAO || ' ' || PD.DESCRICAO                                                                     
    END OPERACAO, `;   

  return { listarAutorizacoesPendentes, processarSolicitacao };
};
