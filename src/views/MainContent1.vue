<template>
  <div class="main-content">
    <h2 class="profile-title">个人资料</h2>
    
    <!-- 查看模式 -->
    <div v-if="!isEditing && userInfo" class="profile-card">
      <div class="profile-header">
        <div class="avatar-wrapper">
          <div class="avatar">{{ userInfo.avatar_url ? '' : '👤' }}</div>
        </div>
        <div class="profile-basic">
          <div class="nickname">{{ userInfo.nickname || userInfo.username }}</div>
          <div class="profile-tags">
            <span class="role-tag" :class="userInfo.role === 'admin' ? 'admin' : 'user'">
              {{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}
            </span>
            <span class="status-tag" :class="userInfo.status === 0 ? 'active' : 'inactive'">
              {{ userInfo.status === 0 ? '正常' : '禁用/注销' }}
            </span>
          </div>
        </div>
      </div>
      <div class="profile-details">
        <table>
          <tr v-for="item in profileItems" :key="item.label">
            <td class="icon-cell"><span class="item-icon">{{ item.icon }}</span>{{ item.label }}</td>
            <td class="value-cell">{{ item.value }}</td>
          </tr>
        </table>
      </div>
      <div class="profile-actions">
        <button class="edit-btn" @click="startEdit">编辑资料</button>
      </div>
    </div>

    <!-- 编辑模式 -->
    <div v-if="isEditing && userInfo" class="profile-card">
      <div class="edit-header">
        <h3>编辑个人资料</h3>
        <p class="edit-tip">请填写您要修改的信息</p>
      </div>
      
      <form @submit.prevent="saveProfile" class="edit-form">
        <div class="form-group">
          <label>用户名</label>
          <input type="text" :value="userInfo.username" disabled class="disabled-input">
          <small>用户名不可修改</small>
        </div>

        <div class="form-group">
          <label>昵称</label>
          <input type="text" v-model="editForm.nickname" placeholder="请输入昵称" maxlength="64">
        </div>

        <div class="form-group">
          <label>邮箱</label>
          <input type="email" v-model="editForm.email" placeholder="请输入邮箱">
        </div>

        <div class="form-group">
          <label>手机号</label>
          <input type="tel" v-model="editForm.phone" placeholder="请输入手机号">
        </div>

        <div class="form-group">
          <label>性别</label>
          <select v-model="editForm.gender">
            <option value="0">保密</option>
            <option value="1">男</option>
            <option value="2">女</option>
          </select>
        </div>

        <div class="form-group">
          <label>生日</label>
          <input type="date" v-model="editForm.birthday">
        </div>

        <div class="form-group">
          <label>省份</label>
          <select v-model="editForm.province" @change="onProvinceChange">
            <option value="">请选择省份</option>
            <option v-for="province in provinces" :key="province.name" :value="province.name">
              {{ province.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>城市</label>
          <select v-model="editForm.city" :disabled="!editForm.province">
            <option value="">请选择城市</option>
            <option v-for="city in currentCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>个人简介</label>
          <textarea v-model="editForm.intro" placeholder="请输入个人简介" maxlength="255" rows="3"></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="cancelEdit">取消</button>
          <button type="submit" class="save-btn" :disabled="loading">
            {{ loading ? '保存中...' : '保存' }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="!userInfo">
      <p>未获取到用户信息，请重新登录。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'

const userInfo = ref<any>(null)
const isEditing = ref(false)
const loading = ref(false)

const editForm = reactive({
  nickname: '',
  email: '',
  phone: '',
  gender: '0',
  birthday: '',
  province: '',
  city: '',
  intro: ''
})

// 中国省市数据
const provinces = [
  { name: '北京市', cities: ['北京市'] },
  { name: '天津市', cities: ['天津市'] },
  { name: '河北省', cities: ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'] },
  { name: '山西省', cities: ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'] },
  { name: '内蒙古自治区', cities: ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟'] },
  { name: '辽宁省', cities: ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'] },
  { name: '吉林省', cities: ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边朝鲜族自治州'] },
  { name: '黑龙江省', cities: ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市', '大兴安岭地区'] },
  { name: '上海市', cities: ['上海市'] },
  { name: '江苏省', cities: ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'] },
  { name: '浙江省', cities: ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'] },
  { name: '安徽省', cities: ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市'] },
  { name: '福建省', cities: ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'] },
  { name: '江西省', cities: ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'] },
  { name: '山东省', cities: ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '莱芜市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'] },
  { name: '河南省', cities: ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市', '济源市'] },
  { name: '湖北省', cities: ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施土家族苗族自治州'] },
  { name: '湖南省', cities: ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州'] },
  { name: '广东省', cities: ['广州市', '韶关市', '深圳市', '珠海市', '汕头市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'] },
  { name: '广西壮族自治区', cities: ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'] },
  { name: '海南省', cities: ['海口市', '三亚市', '三沙市', '儋州市'] },
  { name: '重庆市', cities: ['重庆市'] },
  { name: '四川省', cities: ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'] },
  { name: '贵州省', cities: ['贵阳市', '六盘水市', '遵义市', '安顺市', '毕节市', '铜仁市', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'] },
  { name: '云南省', cities: ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州', '大理白族自治州', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州'] },
  { name: '西藏自治区', cities: ['拉萨市', '日喀则市', '昌都市', '林芝市', '山南市', '那曲市', '阿里地区'] },
  { name: '陕西省', cities: ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'] },
  { name: '甘肃省', cities: ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏回族自治州', '甘南藏族自治州'] },
  { name: '青海省', cities: ['西宁市', '海东市', '海北藏族自治州', '黄南藏族自治州', '海南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'] },
  { name: '宁夏回族自治区', cities: ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'] },
  { name: '新疆维吾尔自治区', cities: ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市', '昌吉回族自治州', '博尔塔拉蒙古自治州', '巴音郭楞蒙古自治州', '阿克苏地区', '克孜勒苏柯尔克孜自治州', '喀什地区', '和田地区', '伊犁哈萨克自治州', '塔城地区', '阿勒泰地区'] },
  { name: '台湾省', cities: ['台北市', '新北市', '桃园市', '台中市', '台南市', '高雄市'] },
  { name: '香港特别行政区', cities: ['香港特别行政区'] },
  { name: '澳门特别行政区', cities: ['澳门特别行政区'] }
]

// 当前选中省份的城市列表
const currentCities = computed(() => {
  const province = provinces.find(p => p.name === editForm.province)
  return province ? province.cities : []
})

onMounted(() => {
  const stored = localStorage.getItem('userInfo')
  if (stored) {
    try {
      userInfo.value = JSON.parse(stored)
    } catch {}
  }
})

function formatTime(val: string | null) {
  if (!val) return '无';
  return val.replace('T', ' ').slice(0, 19)
}
function formatDate(val: string | null) {
  if (!val) return '未设置';
  return val.slice(0, 10)
}
function genderText(val: number | null | undefined) {
  if (val === 1) return '男';
  if (val === 2) return '女';
  return '保密';
}

// 解析地区信息
function parseLocation(location: string | null) {
  if (!location) return { province: '', city: '' }
  const parts = location.split(' ')
  if (parts.length >= 2) {
    return { province: parts[0], city: parts[1] }
  }
  return { province: location, city: '' }
}

// 格式化地区显示
function formatLocation(location: string | null) {
  if (!location) return '未设置'
  return location
}

const profileItems = computed(() => userInfo.value ? [
  { label: '用户名', icon: '🆔', value: userInfo.value.username },
  { label: '昵称', icon: '👤', value: userInfo.value.nickname || '未设置' },
  { label: '邮箱', icon: '📧', value: userInfo.value.email || '未绑定' },
  { label: '手机号', icon: '📱', value: userInfo.value.phone || '未绑定' },
  { label: '注册时间', icon: '🕒', value: formatTime(userInfo.value.register_time) },
  { label: '最后登录', icon: '⏰', value: formatTime(userInfo.value.last_login_time) },
  { label: '性别', icon: '🚻', value: genderText(userInfo.value.gender) },
  { label: '生日', icon: '🎂', value: formatDate(userInfo.value.birthday) },
  { label: '地区', icon: '📍', value: formatLocation(userInfo.value.location) },
  { label: '简介', icon: '📝', value: userInfo.value.intro || '未填写' },
  { label: '成就点数', icon: '🏆', value: userInfo.value.achievement || 0 },
  { label: '学习时长', icon: '⏳', value: (userInfo.value.study_hours || 0) + ' 小时' },
  { label: '认证状态', icon: '✅', value: userInfo.value.is_verified ? '已认证' : '未认证' },
] : [])

function startEdit() {
  editForm.nickname = userInfo.value.nickname || ''
  editForm.email = userInfo.value.email || ''
  editForm.phone = userInfo.value.phone || ''
  editForm.gender = userInfo.value.gender?.toString() || '0'
  
  // 修复生日时区问题 - 直接截取日期部分，避免时区转换
  if (userInfo.value.birthday) {
    // 直接截取 YYYY-MM-DD 部分，不进行任何时区转换
    editForm.birthday = userInfo.value.birthday.slice(0, 10)
  } else {
    editForm.birthday = ''
  }
  
  // 解析地区信息
  const locationInfo = parseLocation(userInfo.value.location)
  editForm.province = locationInfo.province
  editForm.city = locationInfo.city
  
  editForm.intro = userInfo.value.intro || ''
  isEditing.value = true
}

function cancelEdit() { 
  isEditing.value = false 
}

// 省份改变时清空城市选择
function onProvinceChange() {
  editForm.city = ''
}

async function saveProfile() {
  loading.value = true
  try {
    // 组合地区信息
    const location = editForm.province && editForm.city 
      ? `${editForm.province} ${editForm.city}` 
      : (editForm.province || null)
    
    // 处理生日日期 - 直接使用选择的日期，不进行任何转换
    const birthday = editForm.birthday || null
    
    const response = await fetch('http://localhost:3000/api/auth/update-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: userInfo.value.id,
        nickname: editForm.nickname || null,
        email: editForm.email || null,
        phone: editForm.phone || null,
        gender: parseInt(editForm.gender),
        birthday: birthday,
        location: location,
        intro: editForm.intro || null
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || '更新失败');
    userInfo.value = result.data
    localStorage.setItem('userInfo', JSON.stringify(result.data))
    isEditing.value = false
    alert('个人资料更新成功！')
  } catch (error: any) {
    alert(error.message || '更新失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.main-content {
  padding: 32px;
  max-width: 600px;
  margin: 0 auto;
}
.profile-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  color: #4f5bd5;
  margin-bottom: 32px;
  letter-spacing: 2px;
}
.profile-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 32px rgba(102, 126, 234, 0.10);
  padding: 36px 28px 28px 28px;
  margin-bottom: 32px;
  transition: box-shadow 0.2s;
}
.profile-card:hover {
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.16);
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 28px;
}
.avatar-wrapper {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar {
  width: 80px;
  height: 80px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  color: #764ba2;
  font-weight: 700;
}
.profile-basic {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.nickname {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2px;
}
.profile-tags {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
.role-tag, .status-tag {
  display: inline-block;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 1px;
}
.role-tag.user { background: #4f5bd5; }
.role-tag.admin { background: #e67e22; }
.status-tag.active { background: #27ae60; }
.status-tag.inactive { background: #e74c3c; }
.profile-details {
  margin-bottom: 24px;
}
.profile-details table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 6px;
}
.icon-cell {
  color: #888;
  font-weight: 500;
  font-size: 15px;
  width: 120px;
  padding: 8px 0 8px 8px;
  vertical-align: top;
  display: flex;
  align-items: center;
  gap: 8px;
}
.item-icon {
  font-size: 1.1em;
  margin-right: 2px;
}
.value-cell {
  background: #f5f7fa;
  border-radius: 8px;
  color: #333;
  font-size: 15px;
  padding: 8px 12px;
  min-width: 120px;
}
.profile-actions {
  text-align: right;
  margin-top: 18px;
}
.edit-btn {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  padding: 10px 32px;
  border-radius: 18px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.10);
}
.edit-btn:hover {
  background: linear-gradient(90deg, #5a67d8 0%, #764ba2 100%);
  transform: translateY(-2px) scale(1.04);
}

/* 编辑模式样式 */
.edit-header {
  margin-bottom: 24px;
  text-align: center;
}
.edit-header h3 {
  margin: 0 0 8px 0;
  color: #4f5bd5;
  font-size: 1.3rem;
  font-weight: 700;
}
.edit-tip {
  color: #666;
  font-size: 14px;
  margin: 0;
}
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  margin-bottom: 2px;
}
.form-group input, .form-group select, .form-group textarea {
  padding: 12px 14px;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  background: #f8fafc;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px #e6f2fb;
}
.disabled-input {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}
.form-group small {
  color: #666;
  font-size: 12px;
}
.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 20px;
}
.cancel-btn {
  background: #f8f9fa;
  color: #666;
  border: 1.5px solid #ddd;
  padding: 10px 28px;
  border-radius: 12px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}
.cancel-btn:hover {
  background: #e9ecef;
}
.save-btn {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  padding: 10px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.10);
}
.save-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #5a67d8 0%, #764ba2 100%);
  transform: translateY(-2px) scale(1.04);
}
.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
@media (max-width: 700px) {
  .main-content {
    padding: 12px;
    max-width: 100vw;
  }
  .profile-card {
    padding: 18px 6vw 18px 6vw;
  }
  .profile-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  .avatar {
    width: 64px;
    height: 64px;
    font-size: 2rem;
  }
  .nickname {
    font-size: 1.1rem;
  }
  .profile-details td, .value-cell {
    font-size: 13px;
    padding: 6px 6px;
  }
  .edit-btn, .save-btn, .cancel-btn {
    font-size: 14px;
    padding: 8px 16px;
  }
}
</style> 