const express = require('express')
const app = express()
const port = 3000

const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
require('dotenv').config();

// Token của bot từ BotFather
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.GROUP_CHAT_ID;

// Ngày Tết
const TET_DATE = new Date('2025-01-29T00:00:00'); // Tết Âm lịch năm 2025
const quotes = [
  "Hôm nay hãy làm tốt hơn ngày hôm qua một chút.",
  "Không có thành công nào đến từ sự lười biếng.",
  "Mỗi ngày là một cơ hội mới để thay đổi cuộc sống của bạn.",
  "Hãy tin rằng bạn có thể làm được, và bạn đã đi được nửa đường.",
  "Thất bại chỉ là bài học nếu bạn biết đứng lên.",
  "Hạnh phúc không phải là đích đến, mà là hành trình.",
  "Dù chậm đến đâu, hãy cứ tiếp tục tiến lên.",
  "Thời gian không chờ đợi ai, hãy hành động ngay bây giờ.",
  "Đừng so sánh mình với người khác, hãy trở thành phiên bản tốt nhất của chính mình.",
  "Không có áp lực, không có kim cương.",
  "Sự kiên trì là chìa khóa để mở mọi cánh cửa.",
  "Học cách yêu thương bản thân, bạn xứng đáng nhận được điều đó.",
  "Điều tốt đẹp sẽ đến với những ai không ngừng cố gắng.",
  "Hãy nhớ rằng, mọi chuyện đều bắt đầu từ bước đầu tiên.",
  "Chỉ cần bạn không từ bỏ, không gì là không thể.",
  "Cuộc sống là 10% những gì xảy ra với bạn và 90% cách bạn phản ứng.",
  "Luôn luôn có ánh sáng ở cuối con đường tối.",
  "Người kiên nhẫn luôn đạt được những điều tốt đẹp.",
  "Đừng để thất bại làm bạn sợ, hãy để nó làm bạn mạnh mẽ hơn.",
  "Cứ bước tiếp, ngay cả khi bạn cảm thấy muốn dừng lại.",
  "Mỗi ngày đều là cơ hội để bắt đầu lại.",
  "Hãy làm việc chăm chỉ trong im lặng, và để thành công lên tiếng.",
  "Bạn mạnh mẽ hơn bạn nghĩ rất nhiều.",
  "Chấp nhận thử thách là cách để bạn trưởng thành.",
  "Đừng đợi thời gian thích hợp, hãy tạo ra thời gian đó.",
  "Tận dụng từng khoảnh khắc để sống hết mình.",
  "Một tư duy tích cực sẽ dẫn bạn đến một cuộc sống tích cực.",
  "Hãy là lý do khiến ai đó mỉm cười hôm nay.",
  "Tương lai của bạn phụ thuộc vào những gì bạn làm hôm nay.",
  "Nếu bạn ngã bảy lần, hãy đứng dậy tám lần.",
  "Hãy hành động, vì những giấc mơ không tự nhiên thành hiện thực.",
  "Đừng sợ thất bại, hãy sợ không thử.",
  "Thành công không đến từ may mắn, mà từ sự nỗ lực bền bỉ.",
  "Hãy biết ơn những điều nhỏ bé trong cuộc sống.",
  "Càng cố gắng, bạn càng đến gần hơn với mục tiêu.",
  "Một quyết định đúng đắn có thể thay đổi cả cuộc đời.",
  "Hãy dành thời gian để nghỉ ngơi, nhưng đừng từ bỏ.",
  "Mỗi khó khăn là một cơ hội để bạn mạnh mẽ hơn.",
  "Hãy trân trọng hiện tại, vì nó là tất cả những gì bạn có.",
  "Khi bạn tin vào bản thân, không gì là không thể.",
  "Cuộc sống là một chuỗi những bài học, hãy học hỏi không ngừng.",
  "Hãy để nụ cười là vũ khí mạnh nhất của bạn.",
  "Mọi giấc mơ đều có giá trị nếu bạn đủ dũng cảm để theo đuổi.",
  "Hành trình vạn dặm bắt đầu từ một bước chân.",
  "Sự thay đổi không xảy ra qua một đêm, hãy kiên nhẫn.",
  "Đừng chờ đợi cơ hội, hãy tạo ra nó.",
  "Khó khăn chỉ là một phần của thành công.",
  "Tập trung vào điều bạn có, đừng lo lắng về điều bạn không có.",
  "Hãy sống cuộc sống của bạn, đừng sống cuộc đời của người khác.",
  "Học cách nói lời từ chối với những gì không phù hợp với bạn.",
  "Thành công lớn nhất là làm chủ bản thân.",
  "Không có đường tắt đến thành công, chỉ có con đường nỗ lực.",
  "Hãy làm hôm nay tốt nhất có thể, để ngày mai bạn không hối tiếc.",
  "Bạn là người viết nên câu chuyện của cuộc đời mình.",
  "Dũng cảm không phải là không sợ, mà là vượt qua nỗi sợ.",
  "Hãy để mỗi ngày là một trang sách mới của bạn.",
  "Đừng sống quá nhanh mà quên tận hưởng từng khoảnh khắc.",
  "Cuộc sống sẽ dễ dàng hơn khi bạn học cách buông bỏ.",
  "Tập trung vào những gì bạn có thể kiểm soát.",
  "Khi một cánh cửa đóng lại, một cánh cửa khác sẽ mở ra.",
  "Đừng ngừng học hỏi, vì cuộc sống là một trường học không bao giờ kết thúc.",
  "Sự kiên định là chìa khóa để vượt qua mọi thử thách.",
  "Người thành công là người không bao giờ từ bỏ.",
  "Hãy yêu bản thân trước khi yêu bất kỳ ai khác.",
  "Mỗi ngày là một cơ hội để trở thành phiên bản tốt hơn của chính mình.",
  "Khi bạn tin vào giấc mơ, mọi thứ đều có thể.",
  "Đừng chờ đợi người khác làm bạn hạnh phúc, hãy tự tạo ra hạnh phúc.",
  "Hãy đối mặt với những thử thách, đừng trốn tránh chúng.",
  "Mỗi người đều có một ánh sáng riêng, hãy để ánh sáng của bạn tỏa sáng.",
  "Không có ai hoàn hảo, và bạn cũng không cần phải hoàn hảo.",
  "Hãy bước ra khỏi vùng an toàn, đó là nơi điều kỳ diệu xảy ra.",
  "Khi bạn ngã, hãy nhớ rằng bạn có thể đứng lên mạnh mẽ hơn.",
  "Không có giấc mơ nào quá lớn, chỉ có ý chí chưa đủ mạnh.",
  "Hãy đặt mục tiêu lớn, và không ngừng nỗ lực để đạt được.",
  "Khi bạn làm việc chăm chỉ, vận may sẽ mỉm cười với bạn.",
  "Đừng để nỗi sợ thất bại ngăn cản bạn thử thách bản thân.",
  "Cuộc sống là một món quà, hãy sống trọn vẹn từng ngày.",
  "Mỗi thất bại đều mang đến một bài học quý giá.",
  "Hãy đối xử tốt với bản thân, vì bạn là người đồng hành quan trọng nhất.",
  "Tương lai bắt đầu từ những việc nhỏ bé bạn làm hôm nay.",
  "Dù mưa hay nắng, hãy luôn giữ nụ cười trên môi.",
  "Đừng để ý kiến của người khác làm lu mờ ước mơ của bạn.",
  "Hãy tìm niềm vui trong những điều giản dị nhất.",
  "Bạn không cần phải nhanh, bạn chỉ cần không ngừng tiến lên.",
  "Sống chân thành, và bạn sẽ nhận lại được sự chân thành.",
  "Hãy biết ơn những khó khăn, vì chúng giúp bạn trưởng thành.",
  "Điều duy nhất ngăn cách bạn với mục tiêu là chính bạn.",
  "Hãy làm mỗi ngày một điều gì đó khiến bạn tự hào.",
  "Khi bạn thay đổi tư duy, bạn thay đổi cuộc đời.",
  "Hãy dành thời gian để biết bạn thực sự muốn gì.",
  "Hạnh phúc không phải là có tất cả, mà là hài lòng với những gì bạn có.",
  "Mỗi ngày là một cơ hội để bạn đặt ra một tiêu chuẩn mới cho bản thân.",
  "Đừng sợ sự thay đổi, vì nó là cách duy nhất để bạn phát triển.",
  "Sự tự tin đến từ việc thực hiện những điều bạn từng nghĩ rằng không thể.",
  "Những bước nhỏ ngày hôm nay sẽ tạo nên bước tiến lớn trong tương lai.",
  "Thành công không được đo bằng sự giàu có, mà bằng sự bình yên trong tâm hồn.",
  "Đừng để quá khứ trói buộc bạn, hãy sống cho hiện tại và tương lai.",
  "Hãy làm điều khiến bạn sợ, vì đó là cách để bạn phá vỡ giới hạn.",
  "Cuộc đời không phải là chờ đợi cơn bão qua đi, mà là học cách nhảy múa dưới mưa.",
  "Đừng chờ cơ hội gõ cửa, hãy tự xây cánh cửa của chính mình.",
  "Thành công không phải là đích đến, mà là hành trình không ngừng nghỉ.",
  "Hãy nhớ rằng, ngay cả những ngôi sao sáng nhất cũng cần bóng tối để tỏa sáng.",
  "Hãy sống như thể ngày hôm nay là ngày cuối cùng của bạn.",
  "Nếu bạn muốn thay đổi thế giới, hãy bắt đầu từ chính mình.",
  "Không có con đường nào dễ dàng, chỉ có bạn mạnh mẽ hay không.",
  "Hãy kiên nhẫn, vì mọi điều tốt đẹp đều cần thời gian.",
  "Đừng đánh giá giá trị bản thân qua lời nói của người khác.",
  "Hãy tập trung vào điều bạn muốn, chứ không phải điều bạn sợ.",
  "Mỗi sai lầm là một cơ hội để học hỏi và trưởng thành.",
  "Bạn không cần phải hoàn hảo, bạn chỉ cần chân thành.",
  "Thay vì lo lắng về ngày mai, hãy làm hôm nay tốt nhất có thể.",
  "Hãy tìm lý do để cười mỗi ngày.",
  "Mỗi lần bạn vượt qua nỗi sợ, bạn sẽ trở nên mạnh mẽ hơn.",
  "Cuộc sống là ngắn ngủi, đừng lãng phí nó vào những điều tiêu cực.",
  "Hãy tự hào về mọi nỗ lực của mình, dù là nhỏ bé.",
  "Hãy trở thành người mà bạn muốn nhìn thấy trong thế giới này.",
  "Ngừng so sánh bản thân với người khác, bạn là duy nhất.",
  "Không có ai khác chịu trách nhiệm cho hạnh phúc của bạn ngoài chính bạn.",
  "Hãy biết ơn những điều nhỏ bé trong cuộc sống hàng ngày.",
  "Hãy tập trung vào việc làm đúng thay vì chỉ làm nhanh.",
  "Khi bạn tin tưởng vào bản thân, mọi cánh cửa sẽ mở ra.",
  "Thành công đến từ sự chuẩn bị và nỗ lực bền bỉ.",
  "Hãy là phiên bản tốt nhất của chính mình, không phải bản sao của người khác.",
  "Đừng sợ mắc sai lầm, vì đó là cách bạn học hỏi.",
  "Chỉ cần một suy nghĩ tích cực có thể thay đổi cả ngày của bạn.",
  "Hãy nhớ rằng, bạn đã vượt qua rất nhiều để đến được đây.",
  "Thất bại không phải là kết thúc, mà là khởi đầu của một hành trình mới.",
  "Hãy để lòng nhiệt huyết dẫn dắt bạn, không phải nỗi sợ hãi.",
  "Hãy tìm niềm vui trong công việc, và bạn sẽ không phải làm việc một ngày nào.",
  "Sự thay đổi lớn bắt đầu từ những hành động nhỏ mỗi ngày.",
  "Hãy học cách tha thứ, không phải vì họ xứng đáng, mà vì bạn xứng đáng được bình yên.",
  "Đừng ngại làm điều khác biệt, vì đó là cách bạn nổi bật.",
  "Hãy nhớ rằng mọi điều xảy ra đều có lý do.",
  "Đừng để người khác định nghĩa giá trị của bạn.",
  "Hãy tự hỏi mình: Điều này sẽ quan trọng trong 5 năm nữa không?",
  "Hạnh phúc bắt đầu từ sự biết ơn.",
  "Hãy chăm sóc bản thân, vì bạn là nguồn năng lượng chính của chính mình.",
  "Không ai có thể thay đổi cuộc sống của bạn ngoài chính bạn.",
  "Hãy dừng việc tìm kiếm lý do, và bắt đầu hành động.",
  "Bạn không thể kiểm soát mọi thứ, nhưng bạn có thể kiểm soát cách mình phản ứng.",
  "Cuộc sống không đo bằng số năm bạn sống, mà bằng những khoảnh khắc đáng nhớ.",
  "Hãy luôn đặt mình vào vị trí của người khác trước khi đánh giá.",
  "Đừng để ngày hôm nay trôi qua mà không làm gì ý nghĩa.",
  "Hãy dành thời gian để làm điều bạn yêu thích.",
  "Hãy nhớ rằng điều quan trọng không phải là tốc độ, mà là hướng đi.",
  "Đừng ngừng mơ ước, vì giấc mơ là ngọn lửa dẫn đường.",
  "Hãy dành thời gian để tận hưởng từng khoảnh khắc nhỏ bé trong cuộc sống.",
  "Mỗi thử thách là một cơ hội để bạn khám phá khả năng tiềm ẩn của mình.",
  "Hãy tin rằng mọi điều xảy ra đều là bài học quý giá.",
  "Sự bền bỉ và kiên nhẫn sẽ đưa bạn đến nơi bạn muốn.",
  "Hãy học cách yêu thương bản thân, dù bạn không hoàn hảo.",
  "Hãy ngẩng cao đầu, ngay cả khi bạn đang đối mặt với khó khăn.",
  "Cuộc sống là một hành trình, không phải là đích đến.",
  "Đừng để nỗi sợ cản bước tiến của bạn.",
  "Hãy trân trọng những người ở bên bạn khi khó khăn.",
  "Mỗi ngày là một cơ hội để khởi đầu mới.",
  "Hãy làm việc chăm chỉ và để kết quả lên tiếng.",
  "Mọi điều vĩ đại đều bắt đầu từ những bước nhỏ bé.",
  "Hãy sống vì những điều làm bạn cảm thấy thật sự sống động.",
  "Hãy đối mặt với những gì làm bạn lo sợ, vì đó là cách bạn trưởng thành.",
  "Đừng chỉ sống, hãy tạo nên sự khác biệt.",
  "Hãy để trái tim dẫn lối, nhưng đừng quên mang theo lý trí.",
  "Đừng quên mỉm cười, vì đó là cách dễ nhất để lan tỏa hạnh phúc.",
  "Mỗi hành động nhỏ hôm nay sẽ góp phần vào thành công ngày mai.",
  "Hãy dừng việc so sánh và bắt đầu hành động.",
  "Hãy tự hào về những gì bạn đã đạt được, dù nhỏ bé.",
  "Thời gian không chờ đợi ai, hãy tận dụng nó một cách tốt nhất.",
  "Đừng sợ thất bại, vì đó là một phần của thành công.",
  "Cuộc sống không phải là một cuộc đua, mà là một hành trình trải nghiệm.",
  "Hãy đối xử tử tế với mọi người, kể cả chính mình.",
  "Đừng bao giờ đánh giá thấp khả năng của bạn.",
  "Hãy luôn ghi nhớ lý do bạn bắt đầu.",
  "Mỗi ngày đều mang đến cơ hội để học hỏi điều gì đó mới mẻ.",
  "Bạn không cần phải hoàn hảo để được yêu thương.",
  "Hãy tìm kiếm ánh sáng, ngay cả trong những ngày tối nhất.",
  "Hãy luôn nói lời cảm ơn, ngay cả trong những tình huống nhỏ bé.",
  "Hãy giữ vững niềm tin vào bản thân, dù mọi thứ có ra sao.",
  "Hãy nhìn vào điều tích cực, ngay cả trong những tình huống tiêu cực.",
  "Hãy cho bản thân quyền được nghỉ ngơi và nạp năng lượng.",
  "Cuộc sống là một chuỗi lựa chọn, hãy chọn điều làm bạn hạnh phúc.",
  "Hãy lắng nghe tiếng nói bên trong bạn, vì nó biết điều gì là tốt nhất.",
  "Hãy giữ tâm hồn cởi mở và đón nhận những điều mới mẻ.",
  "Không có gì là không thể nếu bạn tin vào chính mình.",
  "Hãy làm việc chăm chỉ, nhưng đừng quên tận hưởng cuộc sống.",
  "Hãy biết rằng mọi nỗ lực của bạn đều có ý nghĩa.",
  "Hãy dừng việc sống trong quá khứ và bắt đầu sống cho hiện tại.",
  "Đừng để bất kỳ ai làm bạn cảm thấy bạn không xứng đáng.",
  "Hãy đặt câu hỏi, vì sự tò mò là chìa khóa để khám phá.",
  "Hãy dành thời gian để thư giãn và tận hưởng những điều đơn giản.",
  "Hãy bước ra khỏi vùng an toàn để khám phá những điều tuyệt vời hơn.",
  "Hãy nhớ rằng mỗi khó khăn đều là một cơ hội để bạn học hỏi.",
  "Đừng lo lắng về những gì bạn không thể kiểm soát.",
  "Hãy tập trung vào việc làm tốt nhất những gì bạn có thể làm.",
  "Hãy để lòng biết ơn là kim chỉ nam trong cuộc sống của bạn.",
  "Hãy nhớ rằng bạn không đơn độc, có người luôn ủng hộ bạn.",
  "Hãy dành thời gian để chăm sóc sức khỏe thể chất và tinh thần của bạn.",
  "Hãy để những trải nghiệm định hình bạn, nhưng không chi phối bạn.",
  "Hãy sống với lòng nhiệt huyết và đam mê.",
  "Hãy luôn tin rằng điều tốt đẹp sẽ đến với bạn.",
  "Hãy tạo ra cơ hội thay vì chờ đợi nó xuất hiện.",
  "Mỗi ngày là một cơ hội để trở thành phiên bản tốt hơn của chính mình.",
  "Hãy trân trọng những người mang lại niềm vui trong cuộc sống của bạn.",
  "Đừng quên dành thời gian cho những gì thực sự quan trọng.",
  "Hãy thử điều gì đó mới, ngay cả khi nó khiến bạn sợ hãi.",
  "Hãy tin rằng bạn có thể vượt qua bất kỳ khó khăn nào.",
  "Đừng để sự nghi ngờ cản trở bước tiến của bạn.",
  "Hãy đặt mục tiêu cao, và đừng ngừng làm việc vì chúng.",
  "Đừng chỉ mơ, hãy biến giấc mơ thành hiện thực.",
  "Hãy để sự kiên nhẫn là sức mạnh lớn nhất của bạn.",
  "Cuộc sống là một món quà, hãy tận hưởng từng phút giây.",
  "Hãy đối xử với người khác theo cách bạn muốn được đối xử.",
  "Hãy giữ tâm trí cởi mở với những ý tưởng mới.",
  "Hãy để những giá trị cốt lõi dẫn dắt hành động của bạn.",
  "Đừng ngần ngại nói lên sự thật của mình.",
  "Hãy nhớ rằng bạn xứng đáng với những điều tốt đẹp nhất.",
  "Mọi thứ đều bắt đầu từ một ý tưởng nhỏ bé.",
  "Hãy trân trọng sức khỏe, vì đó là tài sản lớn nhất của bạn.",
  "Hãy tập trung vào giải pháp, không phải vấn đề.",
  "Hãy biết rằng sự tiến bộ nhỏ mỗi ngày sẽ tạo nên sự thay đổi lớn.",
  "Đừng chờ đợi thời điểm hoàn hảo, hãy bắt đầu ngay bây giờ.",
  "Hãy giữ sự tò mò như một đứa trẻ.",
  "Hãy sống thật với chính mình, ngay cả khi điều đó khó khăn.",
  "Hãy cho đi mà không mong nhận lại.",
  "Hãy tìm niềm vui trong những điều đơn giản nhất.",
  "Hãy tin tưởng rằng ngày mai sẽ tốt đẹp hơn hôm nay.",
  "Mỗi ngày là một cơ hội để tạo ra sự khác biệt.",
  "Hãy dừng việc lo lắng về những điều chưa xảy ra.",
  "Hãy nhớ rằng mọi việc xảy ra đều có lý do của nó.",
  "Hãy biết ơn những điều bạn đang có.",
  "Hãy làm việc chăm chỉ, nhưng cũng đừng quên tận hưởng cuộc sống.",
  "Hãy tìm kiếm sự cân bằng giữa công việc và cuộc sống.",
  "Hãy học cách lắng nghe, vì đó là cách để bạn hiểu sâu hơn.",
  "Hãy dừng việc cố gắng làm hài lòng tất cả mọi người.",
  "Hãy tự hào về những gì bạn đã đạt được.",
  "Hãy dành thời gian để làm mới bản thân.",
  "Hãy nhớ rằng bạn có quyền được hạnh phúc.",
  "Hãy luôn nhìn vào khía cạnh tích cực của mọi vấn đề.",
  "Hãy tin rằng bạn có thể thay đổi thế giới theo cách của mình.",
  "Hãy để lòng biết ơn trở thành thói quen hàng ngày.",
  "Hãy luôn trân trọng thời gian của bạn và người khác.",
  "Hãy học cách tha thứ, ngay cả khi điều đó không dễ dàng.",
  "Hãy luôn đặt câu hỏi để hiểu rõ hơn về mọi thứ.",
  "Hãy tìm kiếm điều tốt đẹp trong mỗi người bạn gặp.",
  "Hãy tập trung vào những gì bạn có thể kiểm soát.",
  "Hãy nhớ rằng bạn có giá trị, dù bất kể điều gì xảy ra.",
  "Hãy học từ quá khứ, nhưng đừng để nó kiểm soát bạn.",
  "Hãy mở lòng đón nhận tình yêu và sự giúp đỡ.",
  "Hãy tự tin bước tiếp, dù con đường có gập ghềnh.",
  "Hãy biết rằng mỗi ngày là một món quà đáng quý.",
  "Hãy đặt niềm tin vào khả năng tự phục hồi của bản thân.",
  "Hãy nhớ rằng bạn không cần phải hoàn hảo để bắt đầu.",
  "Hãy làm điều tốt, ngay cả khi không ai nhìn thấy.",
  "Hãy tin rằng bạn luôn có khả năng làm tốt hơn ngày hôm qua.",
  "Hãy nhớ rằng bạn xứng đáng được yêu thương và tôn trọng.",
  "Hãy để đam mê của bạn dẫn lối trong mọi hành động.",
  "Hãy luôn học hỏi từ những thất bại và sai lầm.",
  "Hãy đối diện với khó khăn thay vì trốn tránh chúng.",
  "Hãy tự nhắc nhở mình rằng mọi thứ sẽ ổn thôi.",
  "Hãy tìm sự bình yên trong chính bản thân, không phải trong hoàn cảnh.",
  "Đừng sợ phải bắt đầu lại, vì mỗi lần bắt đầu là một cơ hội mới.",
  "Hãy nhớ rằng thất bại chỉ là bước đệm của thành công.",
  "Hãy đối diện với nỗi sợ và bạn sẽ thấy mình mạnh mẽ hơn bao giờ hết.",
  "Đừng để những khó khăn nhỏ nhặt làm bạn từ bỏ ước mơ của mình.",
  "Hãy biến mọi thất bại thành bài học quý giá.",
  "Mỗi ngày là một cơ hội để bạn trở thành một con người tốt hơn.",
  "Đừng ngừng nỗ lực, vì thành công thường đến với những người kiên trì nhất.",
  "Cuộc sống không phải lúc nào cũng công bằng, nhưng bạn vẫn có thể chọn cách đối diện với nó.",
  "Hãy nhớ rằng bạn có thể làm được bất cứ điều gì nếu bạn thực sự tin vào bản thân.",
  "Hãy trân trọng những người yêu thương bạn, vì họ là kho báu quý giá.",
  "Hãy cho phép bản thân được nghỉ ngơi và phục hồi.",
  "Hãy sống với mục tiêu và không để những xao lãng cản bước bạn.",
  "Mọi thay đổi lớn đều bắt đầu từ một quyết định nhỏ.",
  "Hãy nhớ rằng cuộc sống là của bạn, và bạn có quyền quyết định nó.",
  "Hãy làm việc với tất cả niềm đam mê và sự cống hiến.",
  "Sự thất bại là mẹ của thành công, đừng sợ nó.",
  "Hãy nhớ rằng mọi thứ đều có thể thay đổi, và bạn có thể làm chủ sự thay đổi đó.",
  "Hãy luôn giữ sự lạc quan, ngay cả khi đối mặt với khó khăn.",
  "Hãy nhìn vào những điều tốt đẹp mà bạn đang có, thay vì những gì bạn thiếu.",
  "Mỗi bước đi dù nhỏ bé cũng đưa bạn đến gần mục tiêu hơn.",
  "Hãy đối diện với mỗi ngày như một cơ hội mới để làm tốt hơn.",
  "Đừng để những lỗi lầm trong quá khứ định hình tương lai của bạn.",
  "Hãy sống hết mình và đừng lo sợ những điều chưa xảy ra.",
  "Hãy đối xử với mọi người bằng lòng tốt, vì bạn không bao giờ biết họ đang đối mặt với những gì.",
  "Hãy nhớ rằng mỗi giây phút qua đi đều là một phần của cuộc sống.",
  "Cuộc sống không bao giờ dễ dàng, nhưng bạn hoàn toàn có thể đối mặt với nó.",
  "Hãy tin rằng những điều tốt đẹp sẽ đến khi bạn kiên trì và nỗ lực.",
  "Đừng bao giờ từ bỏ, vì bạn không biết bạn đã gần thành công đến đâu.",
  "Hãy sống trong hiện tại và đừng quá lo lắng về tương lai.",
  "Hãy biết ơn những thử thách, vì chúng sẽ làm bạn mạnh mẽ hơn.",
  "Hãy để mọi thử thách trở thành cơ hội để phát triển.",
  "Cuộc sống không phải là cuộc đua, mà là hành trình bạn tận hưởng.",
  "Hãy dám ước mơ lớn và đừng sợ thực hiện những ước mơ đó.",
  "Hãy nhớ rằng những gì bạn cho đi sẽ luôn quay lại với bạn.",
  "Đừng bao giờ đánh giá thấp sức mạnh của một nụ cười.",
  "Hãy sống thật với cảm xúc của mình, đừng sống theo kỳ vọng của người khác.",
  "Hãy nhớ rằng sự chân thành luôn mang lại những kết quả tốt đẹp.",
  "Hãy yêu thương chính mình trước khi mong đợi điều đó từ người khác.",
  "Hãy lắng nghe bản thân nhiều hơn và tin tưởng vào những gì bạn cảm thấy.",
  "Đừng bao giờ ngừng học hỏi và phát triển bản thân.",
  "Hãy sống một cuộc sống không hối tiếc, với những quyết định bạn tự hào.",
  "Hãy tìm niềm vui trong những khoảnh khắc nhỏ bé nhất.",
  "Hãy tự hỏi bản thân mỗi ngày: Hôm nay tôi đã học được gì mới?",
  "Hãy tin rằng bạn là người duy nhất có thể viết câu chuyện cuộc đời mình.",
  "Đừng để nỗi sợ thất bại cản trở bạn bước ra khỏi vùng an toàn.",
  "Hãy tin rằng mọi điều xảy ra đều có lý do và đều phục vụ cho sự trưởng thành của bạn.",
  "Cuộc sống là một bài học lớn, hãy học mỗi ngày.",
  "Hãy để lòng tin vào bản thân dẫn dắt bạn trong mọi tình huống.",
  "Hãy luôn nhớ rằng bạn xứng đáng với những điều tuyệt vời trong cuộc sống.",
  "Hãy kiên trì và theo đuổi ước mơ của mình, bất chấp mọi thử thách.",
  "Hãy nhớ rằng bạn có quyền tạo ra tương lai mà bạn mong muốn.",
  "Hãy tự thưởng cho mình sau mỗi nỗ lực, dù nhỏ hay lớn.",
  "Hãy dừng việc so sánh mình với người khác, vì bạn là duy nhất.",
  "Hãy luôn có một trái tim rộng mở và một cái đầu tỉnh táo.",
  "Hãy sống theo cách mà bạn sẽ không phải hối tiếc về bất kỳ quyết định nào.",
  "Hãy nhớ rằng sự thay đổi bắt đầu từ chính bạn."
];
let remainingQuotes = [...quotes];
// Hàm lấy một quote ngẫu nhiên mà không trùng lặp
function getRandomQuote() {
  if (remainingQuotes.length === 0) {
    // Làm mới danh sách nếu tất cả câu đã được chọn
    remainingQuotes = [...originalQuotes];
    console.log('Danh sách quote đã được làm mới.');
  }

  // Lấy ngẫu nhiên 1 câu và xóa khỏi danh sách
  const randomIndex = Math.floor(Math.random() * remainingQuotes.length);
  const randomQuote = remainingQuotes.splice(randomIndex, 1)[0];
  return randomQuote;
}
// Khởi tạo bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
bot.on('message', (msg) => {
  const chatId = msg.chat.id; // Lấy chat_id

  console.log('Chat ID của nhóm: ', chatId); // In chat_id ra console

  // Bạn có thể xử lý thêm lệnh ở đây nếu cần
});
// Hàm gửi random quote
async function sendRandomQuote() {
  const randomQuote = getRandomQuote();

  try {
    await bot.sendMessage(CHAT_ID, randomQuote);
    console.log(`Đã gửi nhắc nhở: ${randomQuote}`);
  } catch (error) {
    console.error('Không thể gửi nhắc nhở:', error.message);
  }
}
// Lên lịch gửi quote mỗi 4 tiếng
schedule.scheduleJob('0 */4 * * *', () => {
  sendRandomQuote();
  console.log('Đã gửi nhắc nhở lúc mỗi 4 tiếng');
});
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
console.log('Bot is running...');
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

