// src/db/seed.ts

import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from './index';
import { sentences } from './schema';

const SAMPLE_SENTENCES = [   // Polski (EASY)
    { id: 1, content: 'Łukasz wciąż żre Bigos i udaje, że ćwiczę.', languageCode: 'pl', difficulty: 'easy' },
    { id: 2, content: 'Żeby sztywny sąsiad wreszcie przestał ćwierkać po angielsku.', languageCode: 'pl', difficulty: 'easy' },

    // Rosyjski (EASY)
    { id: 1, content: 'Жёсткий борщ без сметаны – это просто издевательство над желудком.', languageCode: 'ru', difficulty: 'easy' },
    { id: 2, content: 'Ыканье в каждом слове – наш национальный вид спорта.', languageCode: 'ru', difficulty: 'easy' },

    // Niemiecki (EASY)
    { id: 1, content: 'Jürgen räumt schon wieder frustriert die Spülmaschine auf einmal ein.', languageCode: 'de', difficulty: 'easy' },
    { id: 2, content: 'Mit fünfzehn ß und drei Umlauten klingt alles gleich ernst.', languageCode: 'de', difficulty: 'easy' },

    // Francuski (EASY)
    { id: 1, content: 'Jean-Claude encore mange croissants et prétend être très occupé.', languageCode: 'fr', difficulty: 'easy' },
    { id: 2, content: "Ç'a toujours l'air chic même quand on parle de frites.", languageCode: 'fr', difficulty: 'easy' },

    // Angielski (EASY)
    { id: 1, content: 'Chad keeps saying „bruh" while eating his fifth burger today.', languageCode: 'en', difficulty: 'easy' },
    { id: 2, content: 'Americans really think „y\'all" makes everything instantly cooler.', languageCode: 'en', difficulty: 'easy' },

    // Mandaryński (EASY)
    { id: 1, content: '小明每天只吃泡面还觉得自己超级会生活。', languageCode: 'zh', difficulty: 'easy' },
    { id: 2, content: '四声永远念不对结果听起来像在吵架生气。', languageCode: 'zh', difficulty: 'easy' },

    // Hiszpański (EASY)
    { id: 1, content: 'Juan todavía cree que añadir „¡coño!" lo hace más auténtico.', languageCode: 'es', difficulty: 'easy' },
    { id: 2, content: 'Todos los españoles gritan „¡olé!" aunque solo frían patatas.', languageCode: 'es', difficulty: 'easy' },

    // Portugalski (EASY)
    { id: 1, content: 'O João come pastel de nata e acha que já viajou o mundo.', languageCode: 'pt', difficulty: 'easy' },
    { id: 2, content: 'Brasileiros falam „tipo assim né" em cada frase da vida.', languageCode: 'pt', difficulty: 'easy' },

    // Grecki (EASY)
    { id: 1, content: 'Ο Γιάννης τρώει γύρο κάθε μέρα και λέει «είναι υγιεινό».', languageCode: 'el', difficulty: 'easy' },
    { id: 2, content: 'Όλοι οι Έλληνες βάζουν «ρε» παντού και νομίζουν ότι είναι cool.', languageCode: 'el', difficulty: 'easy' },

    // Turecki (EASY)
    { id: 1, content: 'Mehmet her gün döner yiyor ve buna „diyet" diyor hala.', languageCode: 'tr', difficulty: 'easy' },
    { id: 2, content: 'Türkler her cümleye „ya" koyunca hemen samimi oluyorlar.', languageCode: 'tr', difficulty: 'easy' },

    // Włoski (EASY)
    { id: 1, content: 'Tutti gli italiani finiscono ogni frase con „mamma mia“ per fare dramma epico.', languageCode: 'it', difficulty: 'easy' },
    { id: 2, content: 'Mario gesticola come pazzo anche quando ordina solo un caffè al bar".', languageCode: 'it', difficulty: 'easy' },

    // Arabski (EASY)
    { id: 1, content: 'أحمد يقول والله في كل جملة ويحس إنه صادق جداً.', languageCode: 'ar', difficulty: 'easy' },
    { id: 2, content: 'كل عربي يبدأ الحديث بـ"يا عم" وينتهي بـ"إن شاء الله".', languageCode: 'ar', difficulty: 'easy' },

    // Japoński (EASY)
    { id: 1, content: '田中くんは毎回「です・ます」使って超丁寧なのに超眠そう。', languageCode: 'ja', difficulty: 'easy' },
    { id: 2, content: '日本人は「ね」「よね」入れまくって会話終わらせたくないらしい。', languageCode: 'ja', difficulty: 'easy' },

    // Szwedzki (EASY)
    { id: 1, content: 'Svenskar dricker kaffe på fika och kallar det produktivitet hela dagen.', languageCode: 'sv', difficulty: 'easy' },
    { id: 2, content: 'Allt ska vara lagom – inte för mycket, inte för lite, bara tråkigt.', languageCode: 'sv', difficulty: 'easy' },

    // Duński (MEDIUM)
    { id: 1, content: 'Danskerne drikker kaffe hele dagen og kalder det hygge hele tiden.', languageCode: 'da', difficulty: 'medium' },
    { id: 2, content: 'Alt lyder som om de har en kartoffel i munden og er trætte.', languageCode: 'da', difficulty: 'medium' },

    // Norweski (MEDIUM)
    { id: 1, content: 'Nordmenn sier „det blir nok bra" selv når huset brenner faktisk.', languageCode: 'no', difficulty: 'medium' },
    { id: 2, content: 'De bruker „æ ø å" i hvert ord og tror det er koselig.', languageCode: 'no', difficulty: 'medium' },

    // Niderlandzki (MEDIUM)
    { id: 1, content: 'Nederlanders fietsen door regen met drie jassen en noemen det normaal.', languageCode: 'nl', difficulty: 'medium' },
    { id: 2, content: 'Elke zin eindigt met „hé" of „joh" en klinkt meteen vriendschappelijk.', languageCode: 'nl', difficulty: 'medium' },

    // Czeski (MEDIUM)
    { id: 1, content: 'Čech pije pivo od rána a říká, že to není alkoholismus.', languageCode: 'cs', difficulty: 'medium' },
    { id: 2, content: 'Všude říkají „jo" a „no" a myslí si, že to zní chytře.', languageCode: 'cs', difficulty: 'medium' },

    // Słowacki (MEDIUM)
    { id: 1, content: 'Slovák pije pivo celý deň a tvrdí, že je to zdravá hydratácia.', languageCode: 'sk', difficulty: 'medium' },
    { id: 2, content: 'Každú vetu začína „no" a končí „ty kokot" – ale láskyplne.', languageCode: 'sk', difficulty: 'medium' },

    // Ukraiński (MEDIUM)
    { id: 1, content: "Іван знову п'є каву о п'ятій ранку і називає це „працюю", languageCode: 'uk', difficulty: 'medium' },
    { id: 2, content: 'Кожне речення закінчується „блін" і всі роблять вигляд що це нормально.', languageCode: 'uk', difficulty: 'medium' },

    // Bułgarski (MEDIUM)
    { id: 1, content: 'Иван все още мисли, че добавянето на „бе" го прави по-готин.', languageCode: 'bg', difficulty: 'medium' },
    { id: 2, content: 'Българите клатят глава за „да" и кимат за „не" – класика.', languageCode: 'bg', difficulty: 'medium' },

    // Rumuński (MEDIUM)
    { id: 1, content: 'Ion mănâncă mămăligă cu brânză și zice că e super-dietă.', languageCode: 'ro', difficulty: 'medium' },
    { id: 2, content: 'Toți românii pun „băi" la început și „frate" la final de frază.', languageCode: 'ro', difficulty: 'medium' },

    // Fiński (MEDIUM)
    { id: 1, content: 'Matti juo kahvia kahdeksan kupillista päivässä ja kutsuu sitä normaaliksi.', languageCode: 'fi', difficulty: 'medium' },
    { id: 2, content: 'Jokainen lause venyy äääääää ja öööööö – suomalainen meditaatio.', languageCode: 'fi', difficulty: 'medium' },

    // Węgierski (MEDIUM)
    { id: 1, content: 'István eszik lángost mindennap és azt hiszi, hogy ez sport.', languageCode: 'hu', difficulty: 'medium' },
    { id: 2, content: 'Minden mondat tele van ö-vel, ü-vel és ő-vel – magyar akrobatika.', languageCode: 'hu', difficulty: 'medium' },

    // Litewski (MEDIUM)
    { id: 1, content: 'Jonas valgo cepelinus kasdien ir vadina tai lengvu užkandžiu.', languageCode: 'lt', difficulty: 'medium' },
    { id: 2, content: 'Lietuviai deda „nuuu" į kiekvieną sakinį ir mano kad tai labai giliai.', languageCode: 'lt', difficulty: 'medium' },

    // Łotewski (MEDIUM)
    { id: 1, content: 'Jānis dzer alu katru dienu un saka ka tas ir veselīgi.', languageCode: 'lv', difficulty: 'medium' },
    { id: 2, content: 'Latvijieši liek „nu" un „čau" visur un domā ka tas ir forši.', languageCode: 'lv', difficulty: 'medium' },

    // Koreański (MEDIUM)
    { id: 1, content: '민준이는 매일 라면 먹고 아직도 건강하다고 우기고 있다.', languageCode: 'ko', difficulty: 'medium' },
    { id: 2, content: '한국人は 끝마다 ~요 ~요 붙여서 존댓말인 척 하지만 졸려.', languageCode: 'ko', difficulty: 'medium' },

    // Wietnamski (MEDIUM)
    { id: 1, content: 'Minh ăn phở mỗi ngày và bảo là đang giữ dáng cực tốt.', languageCode: 'vi', difficulty: 'medium' },
    { id: 2, content: 'Người Việt nào cũng thêm „nhé" „nha" vào câu cho thân thiện quá mức.', languageCode: 'vi', difficulty: 'medium' },

    // Perski (MEDIUM)
    { id: 1, content: 'امیر هر روز کباب می‌خورد و فکر می‌کند رژیم گرفته است.', languageCode: 'fa', difficulty: 'medium' },
    { id: 2, content: 'امیر هر روز کباب می‌خورد و فکر می‌کند رژیم گرفته است.', languageCode: 'fa', difficulty: 'medium' },

    // Tajski (MEDIUM)
    { id: 1, content: 'สมชายกินต้มยำกุ้งทุกวันแล้วบอกว่าร่างกายฟิตมากเลยนะ', languageCode: 'th', difficulty: 'medium' },
    { id: 2, content: 'ไทยทุกคนใส่ ครับ/ค่ะ ทุกประโยคแม้แต่ตอนดุคนอื่นเบา ๆ', languageCode: 'th', difficulty: 'medium' },

    // Filipiński (Tagalog) (MEDIUM)
    { id: 1, content: "Si Juan kumakain ng adobo araw-araw tapos sinasabing healthy lifestyle na 'to.", languageCode: 'tl', difficulty: 'medium' },
    { id: 2, content: 'Lahat ng Pinoy nagsasabi ng "ano ba" kahit simpleng tanong lang talaga.', languageCode: 'tl', difficulty: 'medium' },

    // Urdu (MEDIUM)
    { id: 1, content: 'احمد روزانہ بریانی کھاتا ہے اور کہتا ہے کہ یہ ڈائٹ فوڈ ہے یار', languageCode: 'ur', difficulty: 'medium' },
    { id: 2, content: 'ہر جملے میں والا یا یار لگا کر بات پکی سمجھتے ہیں سب', languageCode: 'ur', difficulty: 'medium' },

    // Bengali (MEDIUM)
    { id: 1, content: 'রাহুল প্রতিদিন রসগোল্লা খায় আর বলে এটা তো ডায়েটেই পড়ে', languageCode: 'bn', difficulty: 'medium' },
    { id: 2, content: 'বাঙালিরা প্রত্যেকটা বাক্যে "দাদা" বা "দিদি" ঢুকিয়ে খুব আপন করে', languageCode: 'bn', difficulty: 'medium' },

    // Hindi (MEDIUM)
    { id: 1, content: 'राहुल रोज़ बिरयानी खाता है और बोलता है ये तो हेल्दी खाना है भाई', languageCode: 'hi', difficulty: 'medium' },
    { id: 2, content: 'हर वाक्य में भाई या यार डालकर लगता है दोस्ती पक्की हो गई', languageCode: 'hi', difficulty: 'medium' },

    // Malajski (MEDIUM)
    { id: 1, content: 'Ahmad makan nasi lemak setiap hari dan kata itu diet seimbang sangat.', languageCode: 'ms', difficulty: 'medium' },
    { id: 2, content: 'Semua orang letak lah atau kan hujung ayat supaya nampak mesra gila.', languageCode: 'ms', difficulty: 'medium' },

    // Syngaleski (MEDIUM)
    { id: 1, content: 'සුමිත් රෑට කැවුම් කන්නේ තවමත් හොඳින් ගොඩනැගිලා කියලා හිතනවා.', languageCode: 'si', difficulty: 'medium' },
    { id: 2, content: 'හැම වාක්‍යයකම „අනේ" හෝ „දෙයියනේ" දාලා ගොඩක් ආදරෙයි කියනවා.', languageCode: 'si', difficulty: 'medium' },

    // Indonezyjski (MEDIUM)
    { id: 1, content: 'Budi makan nasi goreng tiap hari dan bilang ini hidup sehat bro.', languageCode: 'id', difficulty: 'medium' },
    { id: 2, content: 'Semua kalimat ditutup „dong" atau „sih" biar keliatan akrab banget.', languageCode: 'id', difficulty: 'medium' },

    // Hebrajski (MEDIUM)
    { id: 1, content: 'יוסי אוכל חומוס כל יום וקורא לזה דיאטה רצינית לגמרי.', languageCode: 'he', difficulty: 'medium' },
    { id: 2, content: 'כל משפט מתחיל ב״יאללה״ או נגמר ב״בקיצור״ – קלאסיקה ישראלית.', languageCode: 'he', difficulty: 'medium' },

    // Gruziński (MEDIUM)
    { id: 1, content: 'გიორგი ყოველდღე ჭამს ხაჭაპურს და ამბობს რომ ეს ჯანსაღია ძალიან.', languageCode: 'ka', difficulty: 'medium' },
    { id: 2, content: 'ყველა წინადადებაში „რა" ან „კარგი?" დებენ და ძალიან მეგობრულად ჟღერს.', languageCode: 'ka', difficulty: 'medium' },

    // Serbski (MEDIUM)
    { id: 1, content: 'Marko jede pljeskavicu svaki dan i kaže da je to zdrava ishrana.', languageCode: 'sr', difficulty: 'medium' },
    { id: 2, content: 'Svaka rečenica počinje sa „bre" ili završava sa „đe si ti" obavezno.', languageCode: 'sr', difficulty: 'medium' },

    // Estoński (MEDIUM)
    { id: 1, content: 'Jüri joob kohvi seitse tassi päevas ja nimetab seda normaalseks eluks.', languageCode: 'et', difficulty: 'medium' },
    { id: 2, content: 'Iga lause venib „noooo" ja „jah-hästi" – eestlane mediteerib rääkides.', languageCode: 'et', difficulty: 'medium' },

    // Białoruski (HARD)
    { id: 1, content: "Іван п'е квас кожны дзень і лічыць гэта супер здаровым напоем.", languageCode: 'be', difficulty: 'hard' },
    { id: 2, content: 'Усе беларусы ставяць „ну" або „вось" у кожным сказе для важнасці.', languageCode: 'be', difficulty: 'hard' },

    // Turkmeński (HARD)
    { id: 1, content: 'Ahmet her gün plov iýýär we muny sagdyn iýmit diýýär ýene-de.', languageCode: 'tk', difficulty: 'hard' },
    { id: 2, content: 'Türkmenler her sözüň soňuna „da" ýa-da „-my" goşýar-da ýakyn bolýar.', languageCode: 'tk', difficulty: 'hard' },

    // Kirgijski (HARD)
    { id: 1, content: 'Бектур күн сайын бешбармак жеп, бул диета экенин айтып жүрөт.', languageCode: 'ky', difficulty: 'hard' },
    { id: 2, content: 'Кыргыздар ар бир сүйлөмгө „эле" же „го" кошуп супер жакын көрүнөт.', languageCode: 'ky', difficulty: 'hard' },

    // Tadżycki (HARD)
    { id: 1, content: 'Ҳасан ҳар рӯз плов мехӯрад ва мегӯяд ин хӯроки парҳезист хеле.', languageCode: 'tg', difficulty: 'hard' },
    { id: 2, content: 'Тоҷикон ҳар ҷумларо бо „ҷон" ё „дигар" тамом мекунанд барои дӯстонагӣ.', languageCode: 'tg', difficulty: 'hard' },

    // Uzbecki (HARD)
    { id: 1, content: "Aziz har kuni palov yeydi va buni sog'lom ovqatlanish deb hisoblaydi.", languageCode: 'uz', difficulty: 'hard' },
    { id: 2, content: "O'zbeklar har gapga -da yoki -ku qo'shib do'stona bo'lib ketadi.", languageCode: 'uz', difficulty: 'hard' },

    // Laotański (HARD)
    { id: 1, content: 'ສົມສັກກິນເຂົ້າໜຽວທຸກມື້ ແລະ ບອກວ່ານີ້ແມ່ນອາຫານສຸຂະພາບດີຫຼາຍ.', languageCode: 'lo', difficulty: 'hard' },
    { id: 2, content: 'ຄົນລາວໃສ່ „ເດີ້" ຫຼື „ແມ່ນ" ໃນທຸກປະໂຫຍກ ເພື່ອໃຫ້ເບິ່ງໃກ້ຊິດຫຼາຍ.', languageCode: 'lo', difficulty: 'hard' },

    // Kazachski (HARD)
    { id: 1, content: 'Әлішер күнде бешбармақ жейді және оны диета деп санайды әлі.', languageCode: 'kk', difficulty: 'hard' },
    { id: 2, content: 'Қазақтар әр сөйлемге „ғой" немесе „ау" қосып супер жақын болады ғой.', languageCode: 'kk', difficulty: 'hard' },

    // Birmański (HARD)
    { id: 1, content: 'ကိုကို့ နေ့စဉ် မုန့်ဟင်းခါး စားပြီး ကျန်းမာရေးအတွက်ကောင်းတယ်လို့ ပြောတယ်။', languageCode: 'my', difficulty: 'hard' },
    { id: 2, content: 'မြန်မာလူမျိုးတိုင်း စကားတိုင်းမှာ „ပါ" နဲ့ „လေ" ထည့်ပြီး အရမ်းချစ်စရာကောင်းသလို လုပ်တယ်။', languageCode: 'my', difficulty: 'hard' },

    // Ormiański (HARD)
    { id: 1, content: 'Հայկը ամեն օր լավաշով խորոված է ուտում և ասում է դա դիետա է։', languageCode: 'hy', difficulty: 'hard' },
    { id: 2, content: 'Բոլոր հայերը ամեն նախադասության մեջ „բա“ կամ „էլի“ են դնում շատ ջերմության համար։', languageCode: 'hy', difficulty: 'hard' },

    // Nepalski (HARD)
    { id: 1, content: 'रामले हरेक दिन दालभात खान्छ र भन्छ यो त हेल्दी खाना हो नि।', languageCode: 'ne', difficulty: 'hard' },
    { id: 2, content: 'नेपालीहरू हरेक वाक्यमा „होला नि" वा „त होला" राख्छन् धेरै नजिक देखिनलाई।', languageCode: 'ne', difficulty: 'hard' },

    // Khmerski (HARD)
    { id: 1, content: 'សុខ ញ៉ាំ បាយសាច់ជ្រូក រាល់ថ្ងៃ ហើយថាវាជាអាហារសុខភាពល្អណាស់។', languageCode: 'km', difficulty: 'hard' },
    { id: 2, content: 'ខ្មែរគ្រប់គ្នាដាក់ „អីចឹងទេ" ឬ „មែនទេ" ចូលគ្រប់ប្រយោគ ដើម្បីឲ្យស្និទ្ធស្នាល។', languageCode: 'km', difficulty: 'hard' },

    // Azerbejdżański (HARD)
    { id: 1, content: 'Rəşad hər gün plov yeyir və deyir ki bu çox sağlam qidadır qardaş.', languageCode: 'az', difficulty: 'hard' },
    { id: 2, content: 'Azərbaycanlılar hər cümləyə „da" ya da „qardaş" qoyur ki yaxın görünsün.', languageCode: 'az', difficulty: 'hard' },

    // Islandzki (HARD)
    { id: 1, content: 'Jónas drekkur kaffi átta bollur á dag og kallar það hollan lífsstíl.', languageCode: 'is', difficulty: 'hard' },
    { id: 2, content: 'Allir setja þ og ð í hvert orð og halda að það sé rosalega fallegt.', languageCode: 'is', difficulty: 'hard' },

    // Luksemburski (HARD)
    { id: 1, content: 'Jean-Claude drénkt nach ëmmer véier Kaffi an nennt dat „ganz entspannt Liewen".', languageCode: 'lb', difficulty: 'hard' },
    { id: 2, content: 'Jiddereen fänkt all Sätz mat „jo" oder „éischter" un a fillt sech ganz gemittlech.', languageCode: 'lb', difficulty: 'hard' },

    // Irlandzki (HARD)
    { id: 1, content: 'Séamus ólann tae le bainne is siúcra agus deir sé go bhfuil sé sláintiúil.', languageCode: 'ga', difficulty: 'hard' },
    { id: 2, content: 'Gach abairt críochnaíonn le „ar bith" nó „go deo" agus tá sin an-Éireannach.', languageCode: 'ga', difficulty: 'hard' },

    // Walijski (HARD)
    { id: 1, content: "Dafydd yfed te gyda llawer o siwgr bob dydd ac yn galw hynny'n iach.", languageCode: 'cy', difficulty: 'hard' },
    { id: 2, content: "Pawb yn rhoi bach neu cariad ym mhob brawddeg i wneud pethau'n fwynach.", languageCode: 'cy', difficulty: 'hard' },

    // Kataloński (HARD)
    { id: 1, content: 'Jordi menja pa amb tomàquet cada dia i diu que és la dieta perfecta.', languageCode: 'ca', difficulty: 'hard' },
    { id: 2, content: "Tots els catalans posen ostres o buf al principi per fer-ho més autèntic.", languageCode: 'ca', difficulty: 'hard' },

    // Mongolski (HARD)
    { id: 1, content: 'Батбаяр идэж байгаа хонины махыг өдөр бүр идээд эрүүл гэж боддог.', languageCode: 'mn', difficulty: 'hard' },
    { id: 2, content: 'Монгол хүн бүх өгүүлбэрт „шүү" „лээ" хийгээд л дуусгадаг шүү дээ.', languageCode: 'mn', difficulty: 'hard' },

    // Cygański (Romani) (HARD)
    { id: 1, content: 'Jano khaben o džan khabe romane džive i phenel ke sastipe si.', languageCode: 'rom', difficulty: 'hard' },
    { id: 2, content: 'Sa o Roma „phrala" na „daje" thoven i phenen ke si amaro.', languageCode: 'rom', difficulty: 'hard' },

    // Baskijski (HARD)
    { id: 1, content: 'Joxe txuleta jaten du egunero eta dio osasungarria dela oso.', languageCode: 'eu', difficulty: 'hard' },
    { id: 2, content: 'Euskaldun guztiek „txapela" jartzen dute eta burua altxatzen dute beti.', languageCode: 'eu', difficulty: 'hard' },

    // Albański (HARD)
    { id: 1, content: 'Fatmir ha qofte çdo ditë dhe thotë se është dietë perfekte fare.', languageCode: 'sq', difficulty: 'hard' },
    { id: 2, content: 'Shqiptarët vënë „o shok" ose „bre" në çdo fjali për tu dukur miqësorë.', languageCode: 'sq', difficulty: 'hard' },

    // Macedoński (HARD)
    { id: 1, content: 'Ѓорѓи јаде таваче кебаби секој ден и вели дека е здраво многу.', languageCode: 'mk', difficulty: 'hard' },
    { id: 2, content: 'Македонците ставаат „бе" или „ма" на крај за да биде супер блиско.', languageCode: 'mk', difficulty: 'hard' },

    // Bośniacki (HARD)
    { id: 1, content: 'Amir jede ćevape svaki dan i kaže da je to zdrava hrana bre.', languageCode: 'bs', difficulty: 'hard' },
    { id: 2, content: 'Svi Bošnjaci stavljaju „bajoo" ili „wallah" da zvuči autentično jako.', languageCode: 'bs', difficulty: 'hard' },

    // Chorwacki (HARD)
    { id: 1, content: 'Ivan jede roštilj svaki dan i misli da je to super dijeta baš.', languageCode: 'hr', difficulty: 'hard' },
    { id: 2, content: 'Hrvati ubacuju „fala" ili „ajme" u svaku rečenicu za dramu.', languageCode: 'hr', difficulty: 'hard' },

    // Słoweński (HARD)
    { id: 1, content: 'Janez pije kavo pet skodelic na dan in pravi da je to normalno.', languageCode: 'sl', difficulty: 'hard' },
    { id: 2, content: 'Slovenci dodajo „pač" ali „veš" v vsak stavek da zveni sproščeno.', languageCode: 'sl', difficulty: 'hard' },
];

async function main() {
    console.log('🌱 Rozpoczynam seedowanie...');

    try {
        // Wyczyść tabelę przed dodaniem nowych danych
        await db.delete(sentences);
        console.log('🗑️ Wyczyszczono starą zawartość tabeli sentences');

        // Wstaw dane w pętli lub batchu
        for (const sent of SAMPLE_SENTENCES) {
            await db.insert(sentences).values({
                content: sent.content,
                languageCode: sent.languageCode,
                difficulty: sent.difficulty as 'easy' | 'medium' | 'hard',
            });
        }

        console.log('✅ Seedowanie zakończone sukcesem!');
    } catch (err) {
        console.error('❌ Błąd podczas seedowania:', err);
    } finally {
        process.exit(0);
    }
}

main();
