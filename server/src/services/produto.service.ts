import { Produto } from "../models/produtos.model";
import { ProdutoRepository } from "../repository/produto.repository";

export class ProdutoService {
  constructor(readonly _repository =  new ProdutoRepository()) {}
  async selecionarTodos(){
    return await this._repository.findAll();
  }
  async selecionarPorId(id: number) {
    return await this._repository.findById(id);
  }
  async criar(nome: string, descricao: string, preco: number, categoriaId: number) {
    const produto = Produto.criar(nome, descricao, preco, categoriaId);
    return await this._repository.create(produto);
  }
  async editar(id: number, nome: string, descricao: string, preco: number, categoriaId: number) {
    const produto = Produto.editar(id, nome, descricao, preco, categoriaId);
    return await this._repository.update(id, produto);
  }
  async deletar(id: number) {
    return await this._repository.delete(id);
  }
}
