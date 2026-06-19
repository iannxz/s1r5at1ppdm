import { RowDataPacket } from "mysql2";

export interface Iproduto extends RowDataPacket {
  id?: number;
  nomeprod: string;
  descricao: string;
  valor: number;
  idcategoria: number;
  ativo?: boolean;
  dataCad?: Date;
}

export class Produto {
  readonly _id?: number;
  private _nome: string = "";
  private _descricao: string = "";
  private _preco: number = 0;
  private _categoriaId: number = 0;
  readonly dataCad?: Date;

  constructor(nome: string, descricao: string, preco: number, categoriaId: number, id?: number) {
    this._nome = nome;
    this._descricao = descricao;
    this._preco = preco;
    this._categoriaId = categoriaId;
    this._id = id;
  }

  public get Id(): number | undefined {
    return this._id;
  }
  public get Nome(): string {
    return this._nome;
  }
  public get Descricao(): string {
    return this._descricao;
  }
  public get Preco(): number {
    return this._preco;
  }
  public get CategoriaId(): number {
    return this._categoriaId;
  }
  public get DataCad(): Date | undefined {
    return this.dataCad;
  }

  public set Nome(value: string) {
    this._validarNome(value);
    this._nome = value;
  }
  public set Descricao(value: string) {
    this._descricao = value;
  }
  public set Preco(value: number) {
    this._validarPreco(value);
    this._preco = value;
  }
  public set CategoriaId(value: number) {
    this._validarCategoriaId(value);
    this._categoriaId = value;
  }

  public static criar(nome: string, descricao: string, preco: number, categoriaId: number): Produto {
    return new Produto(nome, descricao, preco, categoriaId);
  }
  public static editar(id: number, nome: string, descricao: string, preco: number, categoriaId: number): Produto {
    return new Produto(nome, descricao, preco, categoriaId, id);
  }
  public static deletar(id: number): Produto {
    const produto = new Produto("N/A", "", 0, 0, id);
    return produto;
  }

  private _validarNome(value: string): void {
    if (!value || value.trim().length < 3) {
      throw new Error("Nome do produto deve ter pelo menos 3 caracteres");
    }
  }
  private _validarPreco(value: number): void {
    if (value < 0) {
      throw new Error("Preço do produto não pode ser negativo");
    }
  }
  private _validarCategoriaId(value: number): void {
    if (value <= 0) {
      throw new Error("ID da categoria deve ser positivo");
    }
  }
}
