const { body, validationResult } = require('express-validator');

// 验证结果处理中间件
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求数据验证失败',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// 用户注册验证规则
const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度需3-20位')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字、下划线'),
  
  body('password')
    .isLength({ min: 8, max: 20 })
    .withMessage('密码长度需8-20位')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('密码需包含字母和数字'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('请输入有效的手机号'),
  
  body('nickname')
    .optional()
    .trim()
    .isLength({ max: 64 })
    .withMessage('昵称长度不能超过64位'),
  
  handleValidationErrors
];

// 用户登录验证规则
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('请输入用户名'),
  
  body('password')
    .notEmpty()
    .withMessage('请输入密码'),
  
  handleValidationErrors
];

// 用户信息更新验证规则
const validateUserUpdate = [
  body('nickname')
    .optional()
    .trim()
    .isLength({ max: 64 })
    .withMessage('昵称长度不能超过64位'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('请输入有效的手机号'),
  
  body('intro')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('个人简介长度不能超过255位'),
  
  body('gender')
    .optional()
    .isInt({ min: 0, max: 2 })
    .withMessage('性别值无效'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 128 })
    .withMessage('所在地长度不能超过128位'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUserUpdate,
  handleValidationErrors
}; 