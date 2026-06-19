import {db} from "../database/db.connection";
import { Iproduto } from "../models/produtos.model";
import { ResultSetHeader } from "mysql2";

export class ProdutoRepository {
  async findAll(): Promise<Iproduto[]>{
    const [rows] = await db.execute<Iproduto[]>("SELECT * FROM produtos ORDER BY nomeprod;");
    return rows;
  }
  async findById(id: number): Promise<Iproduto | null> {
    const sql = "SELECT * FROM produtos WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<Iproduto[]>(sql, values);
    return rows.length > 0 ? rows[0] : null;
  }
  async create(dados: Omit<Iproduto, 'id'>): Promise<ResultSetHeader> {
    const sql = "INSERT INTO produtos (nomeprod, descricao, valor, idcategoria) VALUES (?, ?, ?, ?);";
    const values = [dados.Nome, dados.Descricao, dados.Preco, dados.CategoriaId];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
  async update(id: number, dados: Omit<Iproduto, 'id'>): Promise<ResultSetHeader> {
    const sql = "UPDATE produtos SET nomeprod = ?, descricao = ?, valor = ?, idcategoria = ? WHERE id = ?;";
    const values = [dados.Nome, dados.Descricao, dados.Preco, dados.CategoriaId, id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
  async delete(id: number): Promise<ResultSetHeader> {
    const sql = "DELETE FROM produtos WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}
