const payItem = {
  system: 0,
};

class PayFactory {
  //获得系统类型：ios,android,ipad
  createSystemType() {}

  //获得支付类型：iap,支付宝，微信，话费
  createPayType() {}

  //获得包月类型：连续包月,1,6,12
  createPayTime() {}

  //获得业务类型：白金会员，音乐包
  createBussinessType() {}

  //判断咪咕版本 ios,android-(~,7.0.8],[7.0.9,7.2.0),[7.2.0,~],ipad any版本
  createMiguVersion() {}
}

class RealPayFactory extends PayFactory {
  constructor() {
    super();
    this.payItem = payItem;
  }

  get() {
    return this.payItem;
  }

  //获得系统类型：ios,android,ipad
  createSystemType() {
    const { payItem } = this;
    payItem.system = 1;
  }

  //获得支付类型：iap,支付宝，微信，话费
  createPayType() {}

  //获得包月类型：连续包月,1,6,12
  createPayTime() {}

  //获得业务类型：白金会员，音乐包
  createBussinessType() {}

  //判断咪咕版本 ios,android-(~,7.0.8],[7.0.9,7.2.0),[7.2.0,~],ipad any版本
  createMiguVersion() {}
}

function formatPayItem() {
  const pay = new RealPayFactory();
  pay.createSystemType();
  pay.createPayType();
  pay.createPayTime();
  pay.createBussinessType();
  pay.createMiguVersion();

  return pay.get();
}
