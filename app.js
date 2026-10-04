'use strict';
const stocks = [
['AAPL','アップル','Apple','iPhone・Macなどの端末とサービス'],
['AMGN','アムジェン','Amgen','バイオ医薬品'],
['AMZN','アマゾン','Amazon','ネット通販・AWSクラウド'],
['AXP','アメリカン・エキスプレス','American Express','クレジットカード・決済'],
['BA','ボーイング','Boeing','航空機・防衛'],
['CAT','キャタピラー','Caterpillar','建設・鉱山機械'],
['CRM','セールスフォース','Salesforce','顧客管理（CRM）クラウド'],
['CSCO','シスコ・システムズ','Cisco Systems','ネットワーク機器・セキュリティ'],
['CVX','シェブロン','Chevron','石油・天然ガス'],
['DIS','ウォルト・ディズニー','The Walt Disney Company','映画・配信・テーマパーク'],
['GOOGL','アルファベット','Alphabet (Class A)','Google検索・広告・クラウド'],
['GS','ゴールドマン・サックス','Goldman Sachs','投資銀行・資産運用'],
['HD','ホーム・デポ','The Home Depot','住宅改修用品の小売'],
['HON','ハネウェル・テクノロジーズ','Honeywell Technologies','産業技術・自動化'],
['IBM','IBM','IBM','企業向けIT・クラウド・コンサルティング'],
['JNJ','ジョンソン・エンド・ジョンソン','Johnson & Johnson','医薬品・医療機器'],
['JPM','JPモルガン・チェース','JPMorgan Chase','銀行・投資銀行'],
['KO','コカ・コーラ','The Coca-Cola Company','清涼飲料'],
['MCD','マクドナルド',"McDonald's",'ファストフード'],
['MMM','3M','3M','産業用素材・接着剤・安全用品'],
['MRK','メルク','Merck & Co.','医薬品・ワクチン'],
['MSFT','マイクロソフト','Microsoft','Windows・Microsoft 365・Azure'],
['NKE','ナイキ','Nike','スポーツ用品・シューズ'],
['NVDA','エヌビディア','NVIDIA','GPU・AI向け半導体'],
['PG','プロクター・アンド・ギャンブル','Procter & Gamble','洗剤・日用品'],
['SHW','シャーウィン・ウィリアムズ','Sherwin-Williams','塗料・コーティング'],
['TRV','トラベラーズ','The Travelers Companies','損害保険'],
['UNH','ユナイテッドヘルス・グループ','UnitedHealth Group','医療保険・医療サービス'],
['V','ビザ','Visa','決済ネットワーク'],
['WMT','ウォルマート','Walmart','総合小売・食品小売']
];
const sectorDefinitions = [
['情報技術','Information Technology',['AAPL','CRM','CSCO','IBM','MSFT','NVDA']],
['金融','Financials',['AXP','GS','JPM','TRV','V']],
['資本財・サービス','Industrials',['BA','CAT','HON','MMM']],
['ヘルスケア','Health Care',['AMGN','JNJ','MRK','UNH']],
['一般消費財・サービス','Consumer Discretionary',['AMZN','HD','MCD','NKE']],
['生活必需品','Consumer Staples',['KO','PG','WMT']],
['コミュニケーション・サービス','Communication Services',['DIS','GOOGL']],
['エネルギー','Energy',['CVX']],
['素材','Materials',['SHW']]
];
const sectorCards=sectorDefinitions.map(([name,english,tickers])=>({name,english,members:tickers.map(ticker=>stocks.find(stock=>stock[0]===ticker))}));
const sectorForTicker=Object.fromEntries(sectorDefinitions.flatMap(([name,,tickers])=>tickers.map(ticker=>[ticker,name])));
const $=id=>document.getElementById(id);
let deck=[...stocks], index=0, flipped=false, missed=[], known=0;
function randomize(a){const result=[...a];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
function baseDeck(){return $('mode').value==='sector'?sectorCards:stocks;}
function start(items){deck=[...items];index=0;missed=[];known=0;flipped=false;render();}
function render(){const sectorMode=$('mode').value==='sector',unit=sectorMode?'業種':'銘柄';$('directionRow').hidden=sectorMode;$('modeHelp').hidden=!sectorMode;$('restart').textContent=sectorMode?'全9業種をもう一周':'30銘柄をもう一周';$('retry').textContent=sectorMode?'もう一度の業種を復習':'もう一度の銘柄を復習';const done=index>=deck.length;$('study').hidden=done;$('complete').hidden=!done;$('position').textContent=done?'周回完了':`${index+1} / ${deck.length}`;$('score').textContent=`覚えた ${known} · もう一度 ${missed.length}`;$('progress').max=deck.length;$('progress').value=index;
if(done){$('result').textContent=`${known} / ${deck.length} ${unit}`;$('summary').textContent=missed.length?`あと${missed.length}${unit}を、もう一度確認しましょう。`:'この周回は、すべて「覚えた」にできました。';$('retry').disabled=!missed.length;return;}
const s=deck[index],reverse=$('direction').value==='ticker';
$('companyAnswers').hidden=!sectorMode||!flipped;$('business').hidden=sectorMode;$('answerText').hidden=sectorMode;
if(sectorMode){$('side').textContent='業種 → 企業名';$('prompt').textContent=s.name;$('english').textContent=`${s.members.length}社 · ${s.english}`;$('answerLabel').textContent=`答え：${s.members.length}社`;$('companyAnswers').replaceChildren();for(const member of s.members){const li=document.createElement('li');const name=document.createElement('span');name.textContent=member[1];const ticker=document.createElement('span');ticker.className='answer-ticker';ticker.textContent=member[0];li.append(name,ticker);$('companyAnswers').append(li);}}
else{$('side').textContent=reverse?'ティッカー':'企業名';$('prompt').textContent=reverse?s[0]:s[1];$('english').textContent=reverse?'':s[2];$('answerLabel').textContent=reverse?'企業名':'ティッカー';$('answerText').textContent=reverse?s[1]:s[0];$('business').textContent=s[3];}
$('answer').hidden=!flipped;$('ratings').hidden=!flipped;$('hint').textContent=flipped?'タップして表に戻る':'タップして答えを見る';$('card').setAttribute('aria-label',flipped?'カードの表に戻る':'カードの答えを見る');}
function flip(){if(index>=deck.length)return;flipped=!flipped;render();}
function rate(remembered){if(index>=deck.length||!flipped)return false;if(remembered)known++;else missed.push(deck[index]);index++;flipped=false;render();if(index<deck.length)$('card').focus();else $('restart').focus();return true;}
$('mode').onchange=()=>start(baseDeck());$('card').onclick=flip;$('again').onclick=()=>rate(false);$('known').onclick=()=>rate(true);$('direction').onchange=()=>{flipped=false;render();};$('shuffle').onclick=()=>{if(index>=deck.length){start(randomize(baseDeck()));return;}deck=[...deck.slice(0,index),...randomize(deck.slice(index))];flipped=false;render();};$('retry').onclick=()=>{if(missed.length)start(randomize(missed));};$('restart').onclick=()=>start(randomize(baseDeck()));
document.addEventListener('keydown',e=>{if(e.target.matches('select,input,textarea')||e.ctrlKey||e.metaKey||e.altKey)return;if(e.code==='Space'){if(e.target.tagName==='BUTTON')return;e.preventDefault();flip();}else if(e.key==='1')rate(false);else if(e.key==='2')rate(true);});
for(const s of stocks){const tr=document.createElement('tr');for(const value of [s[1],s[0],sectorForTicker[s[0]],s[3]]){const td=document.createElement('td');td.textContent=value;tr.append(td);}$('list').append(tr);}
render();
if(document.modelContext?.registerTool){const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});const register=t=>{try{Promise.resolve(document.modelContext.registerTool(t,{signal:lifecycle.signal})).catch(()=>{});}catch{}};register({name:'read_current_card',description:'現在の暗記カードと周回進捗を読み取る。',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({completed:index>=deck.length,index,total:deck.length,known,review:missed.length,flipped,mode:$('mode').value,card:index<deck.length?deck[index]:null})});register({name:'rate_current_card',description:'答えを表示済みの現在のカードを「覚えた」または「もう一度」と判定して進める。',inputSchema:{type:'object',properties:{remembered:{type:'boolean'}},required:['remembered'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(typeof input?.remembered!=='boolean')throw new Error('remembered must be boolean');if(!rate(input.remembered))throw new Error('答えを表示したカードが必要です');return {index,total:deck.length,known,review:missed.length};}});}
