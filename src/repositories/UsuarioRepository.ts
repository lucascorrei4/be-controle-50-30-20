/* eslint-disable camelcase */
import { EntityRepository, Repository } from 'typeorm';

import Usuario from '@models/Usuario';

@EntityRepository(Usuario)
class UsuarioRepository extends Repository<Usuario> {
  public async findIndustriasComEmpresa(): Promise<Usuario[] | null> {
    const findIndustrias: Usuario[] = await this.createQueryBuilder('u')
      .select('u.id, u.nome, u.email, u.telefone, empresas_id as "empresaId", fantasia')
      .innerJoin('empresa_usuarios', 'eu', 'usuarios_id = u.id')
      .innerJoin('empresa', 'e', 'e.id = empresas_id')
      .where('u.perfil = :perfil', { perfil: 'INDUSTRIA' })
      .andWhere('u.is_deletado = :deletado', { deletado: false })
      .andWhere('e.fantasia IS NOT NULL')
      .andWhere('e.razao IS NOT NULL')
      .execute();

    return findIndustrias || null;
  }

  public async findIndustriasSemEmpresa(): Promise<Usuario[] | null> {
    const findIndustrias: Usuario[] = await this.createQueryBuilder('u')
      .select('u.id, u.nome, u.email, u.telefone, empresas_id as "empresaId", fantasia')
      .innerJoin('empresa_usuarios', 'eu', 'usuarios_id = u.id')
      .innerJoin('empresa', 'e', 'e.id = empresas_id')
      .where('u.perfil = :perfil', { perfil: 'INDUSTRIA' })
      .andWhere('u.is_deletado = :deletado', { deletado: false })
      .andWhere('e.fantasia IS NULL')
      .andWhere('e.razao IS NULL')
      .execute();

    return findIndustrias || null;
  }

  public async findIndustrias(): Promise<Usuario[] | null> {
    const findIndustrias: Usuario[] = await this.createQueryBuilder('u')
      .select('u.id, u.nome, u.email, u.telefone, empresas_id as "empresaId", fantasia')
      .innerJoin('empresa_usuarios', 'eu', 'usuarios_id = u.id')
      .innerJoin('empresa', 'e', 'e.id = empresas_id')
      .where('u.perfil = :perfil', { perfil: 'INDUSTRIA' })
      .andWhere('u.is_deletado = :deletado', { deletado: false })
      .execute();

    return findIndustrias || null;
  }

  public async findProdutorComEmpresa(): Promise<Usuario[] | null> {
    const findProdutor: Usuario[] = await this.createQueryBuilder('u')
      .select('u.id, u.nome, u.email, u.telefone, empresas_id as "empresaId", fantasia')
      .innerJoin('empresa_usuarios', 'eu', 'usuarios_id = u.id')
      .innerJoin('empresa', 'e', 'e.id = empresas_id')
      .where('u.perfil = :perfil', { perfil: 'PRODUTOR' })
      .andWhere('u.is_deletado = :deletado', { deletado: false })
      .andWhere('e.fantasia IS NOT NULL')
      .andWhere('e.razao IS NOT NULL')
      .execute();

    return findProdutor || null;
  }

  public async findProdutorSemEmpresa(): Promise<Usuario[] | null> {
    const findProdutor: Usuario[] = await this.createQueryBuilder('u')
      .select('u.id, u.nome, u.email, u.telefone, empresas_id as "empresaId", fantasia')
      .innerJoin('empresa_usuarios', 'eu', 'usuarios_id = u.id')
      .innerJoin('empresa', 'e', 'e.id = empresas_id')
      .where('u.perfil = :perfil', { perfil: 'PRODUTOR' })
      .andWhere('u.is_deletado = :deletado', { deletado: false })
      .andWhere('e.fantasia IS NULL')
      .andWhere('e.razao IS NULL')
      .execute();

    return findProdutor || null;
  }

  public async findProdutor(): Promise<Usuario[] | null> {
    const findProdutor: Usuario[] = await this.createQueryBuilder('u')
      .select('u.id, u.nome, u.email, u.telefone, empresas_id as "empresaId", fantasia')
      .innerJoin('empresa_usuarios', 'eu', 'usuarios_id = u.id')
      .innerJoin('empresa', 'e', 'e.id = empresas_id')
      .where('u.perfil = :perfil', { perfil: 'PRODUTOR' })
      .andWhere('u.is_deletado = :deletado', { deletado: false })
      .execute();

    return findProdutor || null;
  }

  public async findFornecedorComEmpresa(): Promise<Usuario[] | null> {
    const findFornecedor: Usuario[] = await this.createQueryBuilder('u')
      .select('u.id, u.nome, u.email, u.telefone, empresas_id as "empresaId", fantasia')
      .innerJoin('empresa_usuarios', 'eu', 'usuarios_id = u.id')
      .innerJoin('empresa', 'e', 'e.id = empresas_id')
      .where('u.perfil = :perfil', { perfil: 'FORNECEDOR' })
      .andWhere('u.is_deletado = :deletado', { deletado: false })
      .andWhere('e.fantasia IS NOT NULL')
      .andWhere('e.razao IS NOT NULL')
      .execute();

    return findFornecedor || null;
  }

  public async findFornecedorSemEmpresa(): Promise<Usuario[] | null> {
    const findFornecedor: Usuario[] = await this.createQueryBuilder('u')
      .select('u.id, u.nome, u.email, u.telefone, empresas_id as "empresaId", fantasia')
      .innerJoin('empresa_usuarios', 'eu', 'usuarios_id = u.id')
      .innerJoin('empresa', 'e', 'e.id = empresas_id')
      .where('u.perfil = :perfil', { perfil: 'FORNECEDOR' })
      .andWhere('u.is_deletado = :deletado', { deletado: false })
      .andWhere('e.fantasia IS NULL')
      .andWhere('e.razao IS NULL')
      .execute();

    return findFornecedor || null;
  }

  public async findFornecedor(): Promise<Usuario[] | null> {
    const findFornecedor: Usuario[] = await this.createQueryBuilder('u')
      .select('u.id, u.nome, u.email, u.telefone, empresas_id as "empresaId", fantasia')
      .innerJoin('empresa_usuarios', 'eu', 'usuarios_id = u.id')
      .innerJoin('empresa', 'e', 'e.id = empresas_id')
      .where('u.perfil = :perfil', { perfil: 'FORNECEDOR' })
      .andWhere('u.is_deletado = :deletado', { deletado: false })
      .execute();

    return findFornecedor || null;
  }

  public async findUsuariosComEmpresa(): Promise<Usuario[] | null> {
    const findFornecedor: Usuario[] = await this.createQueryBuilder('u')
      .select('u.id, u.nome, u.email, u.telefone, empresas_id as "empresaId", fantasia')
      .innerJoin('empresa_usuarios', 'eu', 'usuarios_id = u.id')
      .innerJoin('empresa', 'e', 'e.id = empresas_id')
      .where('u.is_deletado = :deletado', { deletado: false })
      .andWhere('e.fantasia IS NOT NULL')
      .andWhere('e.razao IS NOT NULL')
      .execute();

    return findFornecedor || null;
  }

  public async findUsuariosSemEmpresa(): Promise<Usuario[] | null> {
    const findFornecedor: Usuario[] = await this.createQueryBuilder('u')
      .select('u.id, u.nome, u.email, u.telefone, empresas_id as "empresaId", fantasia')
      .innerJoin('empresa_usuarios', 'eu', 'usuarios_id = u.id')
      .innerJoin('empresa', 'e', 'e.id = empresas_id')
      .where('u.is_deletado = :deletado', { deletado: false })
      .andWhere('e.fantasia IS NULL')
      .andWhere('e.razao IS NULL')
      .execute();

    return findFornecedor || null;
  }

  public async findUsuarios(): Promise<Usuario[] | null> {
    const findFornecedor: Usuario[] = await this.createQueryBuilder('u')
      .select('u.id, u.nome, u.email, u.telefone, empresas_id as "empresaId", fantasia')
      .innerJoin('empresa_usuarios', 'eu', 'usuarios_id = u.id')
      .innerJoin('empresa', 'e', 'e.id = empresas_id')
      .where('u.is_deletado = :deletado', { deletado: false })
      .execute();

    return findFornecedor || null;
  }
}

export default UsuarioRepository;
