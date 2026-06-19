import { CategoriaRepository } from "../repository/categoria.repository";
import { Categoria } from "../models/categoria.model";

export class CategoriaService {
  constructor(readonly _repository =  new CategoriaRepository()) {}

  async selecionarTodos(){
    return await this._repository.findAll();
  }
  async selecionarPorId(id: number) {
    return await this._repository.findById(id);
  }
  async criar(nome: string) {
    const categoria = Categoria.criar(nome);
    return await this._repository.create(categoria);
  }

  async editar(id: number, nome: string, ativo: boolean) {
    const categoria = Categoria.editar(nome, ativo, id);
    return await this._repository.update(id, categoria);
  }

  async deletar(id: number) {
    const categoria = Categoria.deletar(id);
    return await this._repository.delete(categoria.Id!);
  }
}
