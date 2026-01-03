<template>
  <div class="privacy-page">
    <AnimatedBackground />

    <div class="content-container">
      <NCard class="privacy-card" :bordered="false">
        <h1 class="page-title">隐私政策</h1>
        <div class="last-updated">最后更新日期：2025年1月</div>

        <div class="privacy-content">
          <section class="intro">
            <p>
              趣吧（"我们"、"我们的"或"本服务"）尊重您的隐私，并致力于保护您的个人信息。本隐私政策解释了我们如何收集、使用、披露和保护您的信息。使用本服务即表示您同意本隐私政策的做法。
            </p>
          </section>

          <section class="privacy-section">
            <h2>1. 我们收集的信息</h2>

            <h3>1.1 您提供的信息</h3>
            <p>当您使用本服务时，我们可能收集以下信息：</p>
            <ul>
              <li><strong>账户信息：</strong>姓名、电子邮件地址、个人资料图片、出生日期</li>
              <li><strong>认证信息：</strong>通过第三方服务（如Google）进行身份验证时提供的信息</li>
              <li><strong>兴趣标签：</strong>您选择或生成的兴趣偏好和标签</li>
              <li><strong>内容：</strong>您发布的帖子、评论、图片、视频和其他内容</li>
              <li><strong>通信：</strong>您与我们之间的通信内容</li>
            </ul>

            <h3>1.2 自动收集的信息</h3>
            <p>当您访问或使用本服务时，我们自动收集：</p>
            <ul>
              <li><strong>设备信息：</strong>设备类型、操作系统、浏览器类型、唯一设备标识符</li>
              <li><strong>使用信息：</strong>访问时间、浏览的页面、使用的功能、点击的链接</li>
              <li><strong>位置信息：</strong>基于IP地址的大致地理位置</li>
              <li><strong>日志信息：</strong>服务器日志、错误报告、性能数据</li>
            </ul>

            <h3>1.3 Cookie和类似技术</h3>
            <p>
              我们使用Cookie、Web Beacons和类似技术来收集和存储信息。Cookie是存储在您设备上的小型文本文件，用于记住您的偏好、改善用户体验和分析使用趋势。
            </p>
          </section>

          <section class="privacy-section">
            <h2>2. 我们如何使用您的信息</h2>
            <p>我们使用收集的信息用于：</p>
            <ul>
              <li><strong>提供、维护和改进服务：</strong>处理您的请求、个性化您的体验、开发新功能</li>
              <li><strong>身份验证和安全：</strong>验证您的身份、防止欺诈和滥用、保护账户安全</li>
              <li><strong>个性化推荐：</strong>根据您的兴趣推荐内容、用户和社区</li>
              <li><strong>通信：</strong>发送服务通知、更新、安全警报和营销信息（可选）</li>
              <li><strong>分析：</strong>分析使用趋势、改进服务性能、了解用户行为</li>
              <li><strong>法律合规：</strong>遵守法律义务、响应法律请求、保护我们的权利</li>
            </ul>
          </section>

          <section class="privacy-section">
            <h2>3. 信息共享</h2>

            <h3>3.1 我们不会出售您的个人信息</h3>
            <p>我们不会将您的个人信息出售给第三方。</p>

            <h3>3.2 我们可能共享信息的情况</h3>
            <ul>
              <li><strong>服务提供商：</strong>与帮助我们运营服务的第三方服务提供商（如云存储、数据分析、支付处理）共享必要的信息</li>
              <li><strong>业务转让：</strong>在合并、收购或资产出售的情况下，您的信息可能被转让给相关方</li>
              <li><strong>法律要求：</strong>当我们真诚地认为法律要求、为了保护我们的权利或防止违法行为时披露信息</li>
              <li><strong>经您同意：</strong>在您明确同意的情况下，以其他方式共享信息</li>
            </ul>

            <h3>3.3 公开信息</h3>
            <p>
              您的个人资料信息（姓名、照片、兴趣标签）对其他用户可见。您可以通过账户设置控制哪些信息公开。
            </p>
          </section>

          <section class="privacy-section">
            <h2>4. 数据安全</h2>
            <p>我们采取合理的技术和组织措施保护您的信息免受未经授权的访问、使用或披露：</p>
            <ul>
              <li><strong>加密：</strong>在传输过程中使用SSL/TLS加密</li>
              <li><strong>访问控制：</strong>限制对个人信息的访问权限</li>
              <li><strong>安全审计：</strong>定期进行安全审查和评估</li>
              <li><strong>数据保留：</strong>在必要期限内保留信息，之后安全删除</li>
            </ul>
            <p class="warning">
              尽管我们努力保护您的信息，但没有互联网传输或电子存储方法是100%安全的。虽然我们力求使用合理的手段保护您的个人信息，但我们无法保证其绝对安全。
            </p>
          </section>

          <section class="privacy-section">
            <h2>5. 您的隐私权利</h2>
            <p>根据适用法律，您可能拥有以下权利：</p>
            <ul>
              <li><strong>访问权：</strong>请求访问我们持有的您的个人信息副本</li>
              <li><strong>更正权：</strong>要求更正不准确或不完整的信息</li>
              <li><strong>删除权：</strong>要求删除您的个人信息</li>
              <li><strong>限制处理权：</strong>要求限制我们如何使用您的信息</li>
              <li><strong>数据可携带权：</strong>要求以结构化格式接收您的信息</li>
              <li><strong>反对权：</strong>反对我们处理您的信息</li>
              <li><strong>撤回同意：</strong>撤回之前给予的同意（不影响撤回前的合法性）</li>
            </ul>
            <p>
              要行使这些权利，请通过本政策底部提供的联系方式与我们联系。我们将及时回应您的请求。
            </p>
          </section>

          <section class="privacy-section">
            <h2>6. 第三方链接</h2>
            <p>
              本服务可能包含指向第三方网站或服务的链接。我们对第三方网站的做法或内容不承担任何责任。我们鼓励您在离开本服务时阅读这些第三方的隐私政策。
            </p>
          </section>

          <section class="privacy-section">
            <h2>7. 儿童隐私</h2>
            <p>
              本服务不针对13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。如果我们发现已收集此类信息，我们将采取措施删除它。
            </p>
          </section>

          <section class="privacy-section">
            <h2>8. 数据跨境传输</h2>
            <p>
              您的信息可能被传输到您所在国家/地区以外的国家/地区并在那里处理。这些国家/地区的数据保护法律可能与您所在国家/地区的法律不同。
            </p>
            <p>
              当我们跨境传输您的信息时，我们将采取适当措施确保您的信息得到与本隐私政策一致的保护。
            </p>
          </section>

          <section class="privacy-section">
            <h2>9. 隐私政策的变更</h2>
            <p>
              我们可能会不时更新本隐私政策。变更后，我们将在本页面上发布新的隐私政策，并更新"最后更新日期"。我们建议您定期查看本隐私政策。
            </p>
            <p>
              重大变更将通过电子邮件或服务内的显著通知告知您。继续使用本服务即表示您接受更新后的隐私政策。
            </p>
          </section>

          <section class="privacy-section">
            <h2>10. 联系我们</h2>
            <p>如果您对本隐私政策或我们的信息实践有任何疑问、疑虑或请求，请通过以下方式联系我们：</p>
            <ul>
              <li><strong>邮箱：</strong>privacy@quba.com</li>
              <li><strong>地址：</strong>中国上海市浦东新区张江高科技园区</li>
              <li><strong>联系电话：</strong>+86 21-1234-5678</li>
            </ul>
            <p>
              数据保护官联系方式：<br>
              邮箱：dpo@quba.com
            </p>
          </section>

          <section class="privacy-section">
            <h2>11. 适用法律</h2>
            <p>
              本隐私政策受中华人民共和国法律管辖并依其解释。我们遵守适用的数据保护法律，包括《中华人民共和国个人信息保护法》（PIPL）和《中华人民共和国网络安全法》。
            </p>
          </section>

          <section class="summary-box">
            <h3>隐私原则总结</h3>
            <ul>
              <li>✓ 透明度：我们清楚地解释我们如何使用您的数据</li>
              <li>✓ 控制：您拥有控制个人信息的权利</li>
              <li>✓ 安全：我们实施强安全措施保护您的信息</li>
              <li>✓ 合规：我们遵守全球隐私法规</li>
              <li>✓ 最小化：我们只收集必要的信息</li>
            </ul>
          </section>
        </div>

        <div class="actions">
          <NButton type="primary" size="large" @click="goBack">
            返回登录
          </NButton>
        </div>
      </NCard>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { NCard, NButton } from 'naive-ui'
import AnimatedBackground from '@/components/AnimatedBackground.vue'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.privacy-page {
  min-height: 100vh;
  position: relative;
  padding: 40px 20px;
  overflow-y: auto;
}

.content-container {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
}

.privacy-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  padding: 48px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  text-align: center;
}

.last-updated {
  text-align: center;
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--glass-border);
}

.privacy-content {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 0.95rem;
}

.intro {
  background: rgba(102, 126, 234, 0.1);
  border-left: 4px solid var(--accent-color);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 32px;
}

.intro p {
  margin: 0;
}

.privacy-section {
  margin-bottom: 32px;
}

.privacy-section h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--accent-color);
  display: inline-block;
}

.privacy-section h3 {
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 24px 0 12px 0;
}

.privacy-section p {
  margin-bottom: 16px;
  text-align: justify;
}

.privacy-section strong {
  color: var(--text-primary);
  font-weight: 600;
}

.privacy-section ul {
  list-style: none;
  padding-left: 20px;
  margin-bottom: 16px;
}

.privacy-section ul li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
}

.privacy-section ul li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--accent-color);
  font-weight: bold;
  font-size: 1.2rem;
}

.warning {
  background: rgba(255, 107, 107, 0.1);
  border-left: 4px solid #ff6b6b;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
}

.summary-box {
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid var(--glass-border);
  border-radius: 16px;
  padding: 24px;
  margin: 32px 0;
}

.summary-box h3 {
  color: var(--text-primary);
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
}

.summary-box ul {
  list-style: none;
  padding: 0;
}

.summary-box ul li {
  padding: 8px 0;
  color: var(--text-secondary);
}

.actions {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--glass-border);
  display: flex;
  justify-content: center;
  gap: 16px;
}

:deep(.n-card) {
  background: transparent !important;
}

@media (max-width: 768px) {
  .privacy-card {
    padding: 32px 24px;
  }

  .page-title {
    font-size: 2rem;
  }

  .privacy-section h2 {
    font-size: 1.3rem;
  }

  .intro,
  .summary-box {
    padding: 16px;
  }
}
</style>
