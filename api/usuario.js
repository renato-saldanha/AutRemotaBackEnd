module.exports = (app) => {
  const getUsuarios =  (req, res) => {
    app
      .db("USUARIOS as U")
      .select({
        ID_USUARIO: 'U.ID_USUARIO',
        NOME_USUARIO: 'U.NOME_USUARIO',
        USUARIO_LOGIN: ` U.ID_USUARIO || cast('-' as varchar(1)) || U.NOME_USUARIO`
       })
      .where("U.ATIVO", parseInt(1))
      .orderBy("U.ID_USUARIO")
      .then((usu) => res.json(usu))
      .catch((e) =>
        res.status(400).send({resposta:`houve um erro ao buscar usuários: ${e}`})
      );
  };

  return { getUsuarios };
};
