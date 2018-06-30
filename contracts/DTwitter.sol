pragma solidity ^0.4.23;

contract Dtwitter {

  // メッセージの構造体です。
  struct Message {
    address sender; // 送信者
    string text; // メッセージ本文
    uint created_at; // マイニングされた時間
  }

  // メッセージ送信時に発火させるイベントです。
  // indexedを指定することで、Javascript側からフィルタ出来るようになります。
  event MessageSent ( uint indexed id, address indexed sender, string text, uint created_at);

  // 全メッセージです。配列上のインデックスがIDになります。
  Message[] public messages;

  // Solidityの新しいコンストラクタの記法です。
  constructor() public
  {
      // Id=0を欠番用にするためのダミーメッセージ
      messages.push(Message(0, "", now));
  }

  // メッセージIDからメッセージデータを取得します。構造体は返せないので多値を返しています。
  function getMessage(uint id) external view returns(uint, address, string, uint)
  {
    // IDが不正ならここで処理が停止します
    require(id < messages.length);

    // 注意：関数内の構造体と配列はデフォルトでブロックチェーンに書き込まれます（実行ごとに手数料がかかります）。
    // memoryを指定することでそれを避けられます。
    Message memory message = messages[id];
    return (id, message.sender, message.text, message.created_at);
  }

  // 最新20件のメッセージを取得します.
  // viewを指定することでブロックチェーンへの書き込みが出来なくなり、手数料がなくなります。
  function getMessages() external view returns (uint[20])
  {
    uint[20] memory results;
    
    // 全メッセージが20件未満の場合はそこでループ停止
    uint max = messages.length > 20 ? 20 : messages.length - 1;

    for (uint i=0; i < max; i++)
    {
      uint msgId = messages.length - 1 - i;
      results[i] = msgId;
    }

    return results;
  }

  // recipientに対してtextというメッセージを送ります。
  function sendMessage(string text) external returns(uint)
  {
    // 空メッセージを送ろうとすると処理が停止します
    require(bytes(text).length > 0);
    uint timestamp = now;

    // pushは配列長を返します. -1すると最後のインデックスになります.
    uint id = messages.push(Message(msg.sender, text, timestamp)) - 1;

    // メッセージが送信されたというイベントを発火します.
    emit MessageSent(id, msg.sender, text, timestamp);
    return id;
  }
}
