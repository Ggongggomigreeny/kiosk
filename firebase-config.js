// Firebase 설정 파일
// 이 파일의 설정을 실제 Firebase 프로젝트 설정으로 교체하세요

const firebaseConfig = {
    // Firebase 콘솔에서 가져온 설정을 여기에 입력하세요
    apiKey: "AIzaSyADcjbgKDU8Ih-TGstlbuWRKWqYeXsWS6Y",
    authDomain: "kiosk-cd64c.firebaseapp.com",
    projectId: "kiosk-cd64c",
    storageBucket: "kiosk-cd64c.firebasestorage.app",
    messagingSenderId: "426291981847",
    appId: "1:426291981847:web:6f4ab6464d6fe0c4bcf652",
    measurementId: "G-P6CKJKBD7P"
};

// 설정을 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
} else {
    window.firebaseConfig = firebaseConfig;
} 