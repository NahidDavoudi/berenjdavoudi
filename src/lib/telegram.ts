import { formatPrice } from './utils';

/**
 * Send order notification to Telegram
 */
export async function sendOrderNotification(order: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.warn('Telegram bot token or chat ID not configured');
    return;
  }
  
  try {
    // Format items
    const itemsList = order.items.map((item: any) => 
      `${item.product.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)} تومان`
    ).join('\n');
    
    // Create message
    const message = `
🛒 *سفارش جدید دریافت شد!*
🆔 شماره سفارش: #${order.id}
👤 مشتری: ${order.user.name}
📱 شماره تماس: ${order.user.phone || 'ثبت نشده'}
💰 مبلغ کل: ${formatPrice(order.totalAmount)} تومان
${order.discountApplied > 0 ? `🏷️ تخفیف: ${formatPrice(order.discountApplied)} تومان` : ''}
💵 مبلغ نهایی: ${formatPrice(order.finalAmount)} تومان
🧾 معرفی شده توسط: ${order.user.referredById ? 'بله' : 'خیر'}
📦 اقلام سفارش:
${itemsList}
📍 آدرس: ${order.address}
📅 تاریخ: ${new Date(order.createdAt).toLocaleString('fa-IR')}
    `;
    
    // Send to Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Telegram API error: ${JSON.stringify(error)}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    throw error;
  }
}

