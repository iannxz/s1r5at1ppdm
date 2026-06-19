import { Request, Response } from "express";
import { CategoriaService } from "../services/categoria.service";
import {
  badRequest,
  notFound,
  parseBoolean,
  parsePositiveInteger,
  requiredName,
  serverError,
} from "../utils/request";

export class CategoriaController {
  constructor(readonly _service = new CategoriaService()) {}

  selecionarTodos = async (_req: Request, res: Response) => {
    try {
      const categorias = await this._service.selecionarTodos();
      return res.status(200).json({ categorias });
    } catch (error: unknown) {
      return serverError(res, "Erro ao selecionar categorias", error);
    }
  };

  selecionarPorId = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      if (!id) {
        return badRequest(res, "ID da categoria invalido.");
      }

      const categoria = await this._service.selecionarPorId(id);
      if (!categoria) {
        return notFound(res, "Categoria nao encontrada.");
      }

      return res.status(200).json({ categoria });
    } catch (error: unknown) {
      return serverError(res, "Erro ao selecionar categoria por ID", error);
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const nome = requiredName(req.body.nome);
      if (!nome) {
        return badRequest(res, "Nome da categoria deve ter pelo menos 3 caracteres.");
      }

      const resultado = await this._service.criar(nome);
      return res.status(201).json({
        message: "Categoria criada com sucesso.",
        id: resultado.insertId,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao criar categoria", error);
    }
  };

  editar = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      const nome = requiredName(req.body.nome);
      const ativo = parseBoolean(req.body.ativo, true);

      if (!id) {
        return badRequest(res, "ID da categoria invalido.");
      }

      if (!nome) {
        return badRequest(res, "Nome da categoria deve ter pelo menos 3 caracteres.");
      }

      if (ativo === null) {
        return badRequest(res, "ativo deve ser booleano.");
      }

      const resultado = await this._service.editar(id, nome, ativo);
      if (resultado.affectedRows === 0) {
        return notFound(res, "Categoria nao encontrada para editar.");
      }

      return res.status(200).json({
        message: "Categoria editada com sucesso.",
        id,
        alterados: resultado.affectedRows,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao editar categoria", error);
    }
  };

  deletar = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      if (!id) {
        return badRequest(res, "ID da categoria invalido.");
      }

      const resultado = await this._service.deletar(id);
      if (resultado.affectedRows === 0) {
        return notFound(res, "Categoria nao encontrada para deletar.");
      }

      return res.status(200).json({
        message: "Categoria deletada com sucesso.",
        id,
        deletados: resultado.affectedRows,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao deletar categoria", error);
    }
  };
}
