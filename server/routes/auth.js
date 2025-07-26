const express = require('express');
const User = require('../models/User');
const { validateRegister, validateLogin } = require('../middleware/validation');

const router = express.Router();

// 用户注册
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { username, email, phone, password, nickname } = req.body;

    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }

    // 检查邮箱是否已被使用
    if (email) {
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: '邮箱已被使用'
        });
      }
    }

    // 检查手机号是否已被使用
    if (phone) {
      const existingPhone = await User.findByPhone(phone);
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: '手机号已被使用'
        });
      }
    }

    // 创建用户
    const userData = {
      username,
      email: email || null,
      phone: phone || null,
      password,
      nickname: nickname || null
    };

    const newUser = await User.create(userData);

    // 返回成功响应（不包含敏感信息）
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        nickname: newUser.nickname,
        role: newUser.role,
        register_time: newUser.register_time
      }
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: error.message || '注册失败，请稍后重试'
    });
  }
});

// 用户登录
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户（支持用户名、邮箱、手机号登录）
    let user = await User.findByUsername(username);
    
    if (!user) {
      // 尝试邮箱登录
      user = await User.findByEmail(username);
    }
    
    if (!user) {
      // 尝试手机号登录
      user = await User.findByPhone(username);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 检查用户状态
    if (user.status !== 0) {
      return res.status(401).json({
        success: false,
        message: '账户已被禁用或注销'
      });
    }

    // 验证密码
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 更新最后登录时间
    await User.updateLastLoginTime(user.id);

    // 返回用户信息（不包含敏感信息）
    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      role: user.role,
      status: user.status,
      register_time: user.register_time,
      last_login_time: user.last_login_time,
      intro: user.intro,
      gender: user.gender,
      birthday: user.birthday,
      location: user.location,
      achievement: user.achievement,
      study_hours: user.study_hours,
      is_verified: user.is_verified
    };

    res.json({
      success: true,
      message: '登录成功',
      data: userInfo
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    });
  }
});

// 检查用户名是否可用
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const exists = await User.isUsernameExists(username);
    
    res.json({
      success: true,
      data: {
        username,
        available: !exists
      }
    });
  } catch (error) {
    console.error('检查用户名错误:', error);
    res.status(500).json({
      success: false,
      message: '检查失败，请稍后重试'
    });
  }
});

// 检查邮箱是否可用
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const exists = await User.isEmailExists(email);
    
    res.json({
      success: true,
      data: {
        email,
        available: !exists
      }
    });
  } catch (error) {
    console.error('检查邮箱错误:', error);
    res.status(500).json({
      success: false,
      message: '检查失败，请稍后重试'
    });
  }
});

// 检查手机号是否可用
router.get('/check-phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const exists = await User.isPhoneExists(phone);
    
    res.json({
      success: true,
      data: {
        phone,
        available: !exists
      }
    });
  } catch (error) {
    console.error('检查手机号错误:', error);
    res.status(500).json({
      success: false,
      message: '检查失败，请稍后重试'
    });
  }
});

// 更新用户信息
router.put('/update-profile', async (req, res) => {
  try {
    const { id, nickname, email, phone, intro, gender, birthday, location } = req.body;

    // 验证用户ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '用户ID不能为空'
      });
    }

    // 检查用户是否存在
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 检查邮箱是否被其他用户使用
    if (email && email !== existingUser.email) {
      const emailUser = await User.findByEmail(email);
      if (emailUser && emailUser.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: '邮箱已被其他用户使用'
        });
      }
    }

    // 检查手机号是否被其他用户使用
    if (phone && phone !== existingUser.phone) {
      const phoneUser = await User.findByPhone(phone);
      if (phoneUser && phoneUser.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: '手机号已被其他用户使用'
        });
      }
    }

    // 构建更新数据
    const updateData = {};
    if (nickname !== undefined) updateData.nickname = nickname;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (intro !== undefined) updateData.intro = intro;
    if (gender !== undefined) updateData.gender = gender;
    if (location !== undefined) updateData.location = location;
    
    // 特殊处理生日日期，确保格式正确
    if (birthday !== undefined) {
      if (birthday) {
        // 确保日期格式为 YYYY-MM-DD
        const dateMatch = birthday.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) {
          const [, year, month, day] = dateMatch;
          // 验证日期有效性
          const date = new Date(year, month - 1, day);
          if (date.getFullYear() == year && 
              date.getMonth() == month - 1 && 
              date.getDate() == day) {
            updateData.birthday = `${year}-${month}-${day}`;
          } else {
            return res.status(400).json({
              success: false,
              message: '生日日期格式无效'
            });
          }
        } else {
          return res.status(400).json({
            success: false,
            message: '生日日期格式应为 YYYY-MM-DD'
          });
        }
      } else {
        updateData.birthday = null;
      }
    }

    // 更新用户信息
    const updatedUser = await User.updateById(id, updateData);

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: '更新失败，请稍后重试'
      });
    }

    // 返回更新后的用户信息（不包含敏感信息）
    const userInfo = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
      nickname: updatedUser.nickname,
      avatar_url: updatedUser.avatar_url,
      role: updatedUser.role,
      status: updatedUser.status,
      register_time: updatedUser.register_time,
      last_login_time: updatedUser.last_login_time,
      intro: updatedUser.intro,
      gender: updatedUser.gender,
      birthday: updatedUser.birthday,
      location: updatedUser.location,
      achievement: updatedUser.achievement,
      study_hours: updatedUser.study_hours,
      is_verified: updatedUser.is_verified
    };

    res.json({
      success: true,
      message: '用户信息更新成功',
      data: userInfo
    });

  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: error.message || '更新失败，请稍后重试'
    });
  }
});

module.exports = router; 