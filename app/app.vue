<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #fdfcf8 0%, #f5f2e8 100%); font-family: 'Noto Serif SC', serif;">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
/* 基础样式 */
* {
  box-sizing: border-box;
}

body {
  font-family: 'Noto Serif SC', serif;
  background: linear-gradient(135deg, #fdfcf8 0%, #f5f2e8 100%);
  color: #212529;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

/* 通用样式类 */
.btn-primary {
  padding: 8px 16px;
  background: #343a40;
  color: #fdfcf8;
  border-radius: 8px;
  border: 1px solid #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
}

.btn-primary:hover {
  background: #495057;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  padding: 8px 16px;
  background: #f5f2e8;
  color: #343a40;
  border-radius: 8px;
  border: 1px solid #ced4da;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
}

.btn-secondary:hover {
  background: #ebe8d8;
  transform: translateY(-1px);
}

.btn-secondary:active {
  transform: translateY(0);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.card {
  background: #fdfcf8;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.input-field {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  background: #faf8f0;
  transition: border-color 0.3s ease;
  font-size: 14px;
}

.input-field:focus {
  outline: none;
  border-color: #495057;
  box-shadow: 0 0 0 3px rgba(73, 80, 87, 0.1);
}

.fade-in {
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f5f2e8;
}

::-webkit-scrollbar-thumb {
  background: #adb5bd;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6c757d;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .btn-primary,
  .btn-secondary {
    min-height: 44px;
    font-size: 16px;
    padding: 12px 16px;
    -webkit-tap-highlight-color: transparent;
  }

  .card {
    padding: 12px;
    border-radius: 6px;
  }

  .input-field {
    min-height: 44px;
    font-size: 16px;
    padding: 12px;
  }

  /* 移动端特定样式 */
  .mobile-menu-overlay {
    backdrop-filter: blur(4px);
  }

  .mobile-sidebar {
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .btn-primary:hover,
  .btn-secondary:hover,
  .card:hover {
    transform: none;
    box-shadow: initial;
  }

  .btn-primary:active,
  .btn-secondary:active {
    transform: scale(0.98);
  }
}

/* 防止移动端缩放 */
input, textarea, select {
  font-size: 16px;
}

/* 安全区域适配 */
@supports (padding: max(0px)) {
  .safe-area-inset-top {
    padding-top: max(16px, env(safe-area-inset-top));
  }

  .safe-area-inset-bottom {
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
}

/* 响应式文本大小 */
@media (max-width: 640px) {
  .text-responsive {
    font-size: 14px;
  }
}

@media (min-width: 641px) {
  .text-responsive {
    font-size: 16px;
  }
}

/* 移动端表格优化 */
@media (max-width: 768px) {
  .mobile-stack > * {
    display: block !important;
    width: 100% !important;
    margin-bottom: 8px;
  }

  .mobile-stack > *:last-child {
    margin-bottom: 0;
  }
}

/* 移动端网格优化 */
@media (max-width: 640px) {
  .mobile-single-col {
    grid-template-columns: 1fr !important;
  }
}
</style>
