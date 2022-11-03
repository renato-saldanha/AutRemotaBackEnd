const { Encripta } = require("../uteis/funcs");

module.exports = (app) => {
  const login = async (req, res) => {
    const id_usuario = req.params.id_usuario;
    const senha = req.params.senha;

    if (id_usuario == 0) {
      res.status(400).send({ resposta: "Favor informar o usuário!" });
      return;
    }

    if (senha == 0) {
      res.status(400).send({ resposta: "Favor digitar a senha!" });
      return;
    }

    const senhaEncriptada = Encripta(senha, id_usuario);

    app
      .db("USUARIOS as U")
      .select(
        `U.ID_USUARIO, U.NOME_USUARIO, U.ID_USUARIO || '-' || U.NOME_USUARIO DESC_USUARIO_LOGIN, U.SENHA`
      )
      .where({
        id_usuario: parseInt(id_usuario),
        senha: senhaEncriptada,
        ativo: parseInt(1),
      })
      .then((usu) =>
        usu[0].senha === senhaEncriptada
          ? res.json(usu[0])
          : res.status(400).send({ resposta: "Senha incorreta" })
      )
      .catch((e) => res.status(400).send({ resposta: "Senha incorreta" }));
  };
  return { login };
};
