<template>
  <div>
    <object id="MediaPlayer" classid="clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95" width="800" height="600" standby="Loading Windows Media Player components…" type="application/x-oleobject" codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=6,4,7,1112">
      <param name="FileName" value="test.avi">
      <param name="AutoStart" value="true">
      <param name="ShowControls" value="true">
      <param name="BufferingTime" value="2">
      <param name="ShowStatusBar" value="true">
      <param name="AutoSize" value="true">
      <param name="InvokeURLs" value="false">
      <param name="AnimationatStart" value="1">
      <param name="TransparentatStart" value="1">
      <param name="Loop" value="1">
      <embed type="application/x-mplayer2" src="././src/assets/v_ApplyLipstick_g01_c01.avi" name="MediaPlayer" autostart="1" showstatusbar="1" showdisplay="1" showcontrols="1" loop="0" videoborder3d="0" pluginspage="http://www.microsoft.com/Windows/MediaPlayer/" width="800" height="600"></embed>
    </object>

  </div>
</template>

<script>

export default {}
</script>

<style scoped>
.uploadfile{
  width: 200px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -100px;
}
.loading{
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: black;
  opacity: 0.8;
}
.progress{
  width: 200px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -100px;
}
.tips{
  color: #409eff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -150px;
}

</style>
