const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
require('dotenv').config();

// Token của bot từ BotFather
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.GROUP_CHAT_ID;

// Ngày Tết
const TET_DATE = new Date('2025-01-29T00:00:00'); // Tết Âm lịch năm 2025

// Khởi tạo bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Hàm tính toán số ngày còn lại
function calculateDaysLeft() {
  const today = new Date();
  const timeDiff = TET_DATE - today;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Số ngày
}

// Hàm đổi tên nhóm
async function updateGroupTitle() {
  const daysLeft = calculateDaysLeft();
  let newTitle;

  if (daysLeft > 0) {
    newTitle = `${daysLeft} ngày nữa Tết !!`;
  } else if (daysLeft === 0) {
    newTitle = 'Hôm nay là Tết !! 🎉';
  } else {
    newTitle = 'Tết đã qua rồi 😅';
  }

  try {
    await bot.setChatTitle(CHAT_ID, newTitle);
    console.log(`Tên nhóm đã được đổi thành: ${newTitle}`);
  } catch (error) {
    console.error('Không thể đổi tên nhóm:', error.message);
  }
}

// Lên lịch đổi tên hằng ngày
schedule.scheduleJob('0 0 * * *', () => {
  updateGroupTitle();
  console.log('Đổi tên nhóm lúc 00:00 mỗi ngày');
});

// Bắt đầu bot và xử lý lệnh
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Kiểm tra nếu tin nhắn là lệnh /daysleft
  if (msg.text) {
    let command = msg.text.trim().toLowerCase();

    // Xử lý trường hợp có @botname (loại bỏ phần @botname nếu có)
    if (command.includes('@')) {
      command = command.split('@')[0]; // Lấy phần trước @ (tức là /daysleft)
    }

    // Nếu lệnh là /daysleft
    if (command === '/daysleft') {
      const daysLeft = calculateDaysLeft();
      const reply = daysLeft > 0
        ? `${daysLeft} ngày nữa là đến Tết !!`
        : daysLeft === 0
          ? 'Hôm nay là Tết !! 🎉'
          : 'Tết đã qua rồi 😅';

      bot.sendMessage(chatId, reply);
    }
  }
});

console.log('Bot Telegram đang chạy...');
