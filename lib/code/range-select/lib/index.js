import React from "react";
import "./index.scss";

// 给Date对象添加getYMD方法，获取字符串形式的年月日
Date.prototype.getYMD = function() {
    var retDate = this.getFullYear() + "-", // 获取年份。
        month = this.getMonth() + 1,
        day  = this.getDate();

    if(month < 10) {
        month = "0" + month;
    }

    if(day < 10) {
        day = "0" + day;
    }
    
    retDate += month + "-"; // 获取月份。
    retDate += day; // 获取日。
    return retDate; // 返回日期。
  };
  
  // 给String对象添加getDate方法，使字符串形式的日期返回为Date型的日期
  String.prototype.getDate = function() {
    var strArr = this.split("-");
    var date = new Date(strArr[0], strArr[1] - 1, strArr[2]);
    return date;
  };
  
export default class Range extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          start: {
              value: null,
              list: []
          },
          end: {
              value: null,
              list: []
          },
          title: this.props.title ? this.props.title : null
      };  
    }
    componentWillMount() {
      var dateArr = this.getPrevMonth();
      var startList = this.getDays(dateArr[0], dateArr[1]);
      var endList = this.getDays(dateArr[0], dateArr[1]);

      var {start, end} = this.state;
      start.list = startList;
      start.value = dateArr[0];
      end.list = endList.reverse();
      end.value = dateArr[1];
  
      this.forceUpdate();
    }
    getPrevMonth() {
      var startDate = new Date(),            
          startMonth = startDate.getMonth() - 1,
          startDay = startDate.getDate() - 1;
      if(startMonth == -1) {
          startDate.setFullYear(startDate.getFullYear()-1);
          startMonth = 11;    
      }
      startDate.setMonth(startMonth);
      startDate.setDate(startDay);
      
      var endDate = new Date(),
          endDay = endDate.getDate() - 1;
        endDate.setDate(endDay);

      return [startDate.getYMD(), endDate.getYMD()];
    }
    getDays(day1, day2) {
      // 获取入参字符串形式日期的Date型日期
      var d1 = day1.getDate();
      var d2 = day2.getDate();
  
      // 定义一天的毫秒数
      var dayMilliSeconds = 1000 * 60 * 60 * 24;
  
      // 获取输入日期的毫秒数
      var d1Ms = d1.getTime();
      var d2Ms = d2.getTime();
  
      // 定义返回值
      var ret;
  
      // 时间列表
      var list = [];
  
      // 对日期毫秒数进行循环比较，直到d1Ms 大于等于 d2Ms 时退出循环
      // 每次循环结束，给d1Ms 增加一天
      for (d1Ms; d1Ms <= d2Ms; d1Ms += dayMilliSeconds) {
        var day = new Date(d1Ms);
        // 获取其年月日形式的字符串
        list.push(day.getYMD());
      }
      return list;
    }    
    changeHandle(){
        this.props.onChange && this.props.onChange([this.state.start.value, this.state.end.value]);
    }
    render(){
        var {start, end} = this.state;
        return <div className="rangebar clearfix" style={this.props.style ? this.props.style : null}>
            <div className="daytit">{this.state.title != null ?  this.state.title : "请选择时间范围"} </div>
            <div className="month">
                <div className="tit"><span>{start.value}</span></div>
                <ul className="drop-down">
                {
                    start.list.map((item,index)=>{
                        return <li key={index} onClick={(e)=>{
                            var date = e.target.innerHTML;
                            start.value = date;
                            this.forceUpdate();
                            this.changeHandle()
                        }}>{item}</li>
                    })
                }
                </ul>
            </div>
            <div className="to">至</div>
                <div className="month">
                    <div className="tit"><span>{end.value}</span></div>
                    <ul className="drop-down">
                    {
                        end.list.map((item, index)=>{
                            return <li key={index} onClick={(e)=>{
                                var date = e.target.innerHTML;
                                end.value = date;
                                this.forceUpdate();
                                this.changeHandle()
                            }}>{item}</li>
                        })
                    }
                    </ul>
                </div>
            <div className="prompt">{this.props.tips || "时间范围为最近1个月"}</div>
        </div>
    }    
}