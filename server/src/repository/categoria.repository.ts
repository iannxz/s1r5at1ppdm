import {db} from "../database/db.connection";
import {Icategoria} from "../models/categoria.model";
import { ResultSetHeader } from "mysql2";

export class CategoriaRepository {
  async findAll(): Promise<Icategoria[]>{
    const [rows] = await db.execute<Icategoria[]>("SELECT * FROM categorias ORDER BY nome;");
    return rows;
  }

  async findById(id: number): Promise<Icategoria | null> {
    const sql = "SELECT * FROM categorias WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<Icategoria[]>(sql, values);
    return rows.length > 0 ? rows[0] : null;
  }
  async create(dados: Omit<Icategoria, 'id'>): Promise<ResultSetHeader> {
    const sql = "INSERT INTO categorias (nome, ativo) VALUES (?, ?);";
    const values = [dados._nome, dados._ativo];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async update(id: number, dados: Omit<Icategoria, 'id'>): Promise<ResultSetHeader> {
    const sql = "UPDATE categorias SET nome = ?, ativo = ? WHERE id = ?;";
    const values = [dados._nome, dados._ativo, id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async delete(id: number): Promise<ResultSetHeader> {
    const sql = "DELETE FROM categorias WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}
