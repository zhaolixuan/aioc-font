import {
    Message
  } from 'element-ui';
  let messageInstance = null;
  const resetMessage = (options,close) => {
    // 如果已经存在实例则关闭
    if(messageInstance) {
        messageInstance.close()
    }
    // 不存在实例则赋予实例
    messageInstance = Message(options)
    // 当有关闭参数的时候关闭实例,为什么添加close参数后面详细说明
    if(close){
      messageInstance.close()
    }
  };
  ['error','success','info','warning'].forEach(type => {
    resetMessage[type] = options => {
        if(typeof options === 'string') {
            options = {
                message:options
            }
        }
        options.type = type
        return resetMessage(options)
    }
  })
  export const Mesage =   resetMessage