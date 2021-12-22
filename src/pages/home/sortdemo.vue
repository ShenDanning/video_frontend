<template>
  <ul id="drag2sortable">
    <li>item1</li>
    <li>item2</li>
    <li>item3</li>
    <li>item4</li>
    <li>item5</li>
    <li>item6</li>
  </ul>
</template>
<script>
var drag = require('drag2sortable/drag2sortable.jquery.js');
import {logout} from "../../api/api";
export default {
  props: {
    message: String //定义传值的类型<br>  }
  },
  watch: {
    message: function(newVal) {
      console.log(newVal);
      this.username= newVal; //一定要写！！！
    }
  },

  data(){
    return{
      username:this.message,
      back: {
        backgroundSize: "100% 100%",
        height: "100%",
        position: "fixed",
        width: "100%",

      },
    }

  },
  methods:{


    }


  }




}
</script>
