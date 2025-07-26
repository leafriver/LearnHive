const { query, transaction } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // 创建用户
  static async create(userData) {
    const {
      username,
      email,
      phone,
      password,
      nickname,
      avatar_url = null,
      role = 'user',
      status = 0,
      intro = null,
      gender = 0,
      birthday = null,
      location = null,
      achievement = 0,
      study_hours = 0,
      is_verified = 0,
      extra = null
    } = userData;

    // 密码加密
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (
        username, email, phone, password_hash, nickname, avatar_url,
        role, status, intro, gender, birthday, location,
        achievement, study_hours, is_verified, extra
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      username, email, phone, password_hash, nickname, avatar_url,
      role, status, intro, gender, birthday, location,
      achievement, study_hours, is_verified, extra
    ];

    try {
      const result = await query(sql, params);
      return {
        id: result.insertId,
        username,
        email,
        phone,
        nickname,
        role,
        status,
        register_time: new Date(),
        is_verified
      };
    } catch (error) {
      // 处理唯一键冲突
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('uk_username')) {
          throw new Error('用户名已存在');
        } else if (error.message.includes('uk_email')) {
          throw new Error('邮箱已被使用');
        } else if (error.message.includes('uk_phone')) {
          throw new Error('手机号已被使用');
        }
      }
      throw error;
    }
  }

  // 根据用户名查找用户
  static async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const users = await query(sql, [username]);
    return users[0] || null;
  }

  // 根据邮箱查找用户
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await query(sql, [email]);
    return users[0] || null;
  }

  // 根据手机号查找用户
  static async findByPhone(phone) {
    const sql = 'SELECT * FROM users WHERE phone = ?';
    const users = await query(sql, [phone]);
    return users[0] || null;
  }

  // 根据ID查找用户
  static async findById(id) {
    const sql = 'SELECT *, DATE_FORMAT(birthday, "%Y-%m-%d") as birthday FROM users WHERE id = ?';
    const users = await query(sql, [id]);
    return users[0] || null;
  }

  // 验证密码
  static async verifyPassword(password, password_hash) {
    return await bcrypt.compare(password, password_hash);
  }

  // 更新用户信息
  static async updateById(id, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    if (fields.length === 0) return null;

    // 特殊处理生日字段，确保以DATE类型存储
    let setClause = '';
    let params = [];
    
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = values[i];
      
      if (field === 'birthday' && value) {
        // 对于生日字段，使用DATE()函数确保只存储日期部分
        setClause += `${field} = DATE(?), `;
        params.push(value);
      } else {
        setClause += `${field} = ?, `;
        params.push(value);
      }
    }
    
    // 移除最后的逗号和空格
    setClause = setClause.slice(0, -2);
    
    const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
    params.push(id);
    
    await query(sql, params);
    
    return await this.findById(id);
  }

  // 更新最后登录时间
  static async updateLastLoginTime(id) {
    const sql = 'UPDATE users SET last_login_time = NOW() WHERE id = ?';
    await query(sql, [id]);
  }

  // 检查用户名是否存在
  static async isUsernameExists(username) {
    const user = await this.findByUsername(username);
    return !!user;
  }

  // 检查邮箱是否存在
  static async isEmailExists(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }

  // 检查手机号是否存在
  static async isPhoneExists(phone) {
    const user = await this.findByPhone(phone);
    return !!user;
  }

  // 获取用户列表（分页）
  static async getUsers(page = 1, limit = 10, filters = {}) {
    let sql = 'SELECT id, username, email, phone, nickname, role, status, register_time, last_login_time FROM users WHERE 1=1';
    const params = [];

    // 添加过滤条件
    if (filters.status !== undefined) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.role) {
      sql += ' AND role = ?';
      params.push(filters.role);
    }

    if (filters.keyword) {
      sql += ' AND (username LIKE ? OR nickname LIKE ? OR email LIKE ?)';
      const keyword = `%${filters.keyword}%`;
      params.push(keyword, keyword, keyword);
    }

    // 添加排序
    sql += ' ORDER BY register_time DESC';

    // 添加分页
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const users = await query(sql, params);
    
    // 获取总数
    const countSql = sql.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM').replace(/ORDER BY.*LIMIT.*OFFSET.*/, '');
    const countResult = await query(countSql, params.slice(0, -2));
    const total = countResult[0].total;

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = User; 