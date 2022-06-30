<template>
  <el-dialog
    title="圖片裁切"
    class="cropper-dialog"
    :close-on-click-modal="false"
    :visible="dialogVisible"
    center
    @close="close"
  >
    <el-radio-group
      v-model="resize"
      @change="cropResize"
    >
      <el-radio
        label="fourThree"
      >
        4:3
      </el-radio>
      <el-radio
        label="threeFour"
      >
        3:4
      </el-radio>
      <el-radio
        label="oneOne"
      >
        1:1
      </el-radio>
    </el-radio-group>
    <div class="cropper-wrap">
      <div
        class="cropper-box"
        :style="cropperStyle"
      >
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="option.info"
          :full="option.full"
          :can-scale="option.canScale"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :fixed="option.fixed"
          :fixed-box="option.fixedBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :center-box="option.centerBox"
          :high="option.high"
          :info-true="option.infoTrue"
          :enlarge="option.enlarge"
          :mode="option.mode"
          :max-img-size="option.maxImgSize"
          :fixed-number="option.fixedNumber"
          @realTime="realTime"
        />
      </div>
      <!-- preview -->
      <!-- <div class="preview-box">
        <div class="preview-title">
          <span>預覽</span>
          <span
            class="preveiw-upload"
            @click="upload"
          >重新上傳</span>
        </div>
        <input
          ref="upload"
          type="file"
          style="position:absolute; clip:rect(0 0 0 0);"
          accept="image/png, image/jpeg, image/jpg"
          @change="uploadImg"
        >
        <div
          :style="previewStyle"
          class="preview-img"
        >
          <div :style="preview.div">
            <img
              :style="preview.img"
              :src="preview.url"
            >
          </div>
        </div>
      </div> -->
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="close">
        取消
      </el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="finish"
      >
        確認
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  name: 'ImageCropper',
  components: {
    VueCropper
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    cropperOption: {
      type: Object,
      default: () => {}
    },
    cropperStyle: {
      type: Object,
      default: () => {}
    },
    fileSize: {
      type: Number,
      default: 2
    },
    // 裁剪預覽圖片縮放比例
    zoom: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      resize: '',
      // 裁剪組件的基礎配置option
      option: {
        img: '', // 裁剪圖片的地址
        outputSize: 1, // 裁剪生成圖片的質量
        outputType: 'png', // 裁剪生成圖片的格式
        full: true, // 是否輸出原圖比例的截圖
        info: true, // 圖片大小信息
        canScale: true, // 圖片是否允許滾輪縮放
        autoCrop: true, // 是否默認生成截圖框
        // 只有自動截圖開啟 寬度高度才生效
        autoCropWidth: 370, // 默認生成截圖框寬度
        autoCropHeight: 150, // 默認生成截圖框高度
        canMove: false, // 上傳圖片是否可以移動
        fixedBox: true, // 固定截圖框大小 不允許改變
        fixed: false, // 是否開啟截圖框寬高固定比例
        canMoveBox: true, // 截圖框能否拖動
        original: false, // 上傳圖片按照原始比例渲染
        centerBox: false, // 截圖框是否被限制在圖片裡面
        height: true,
        infoTrue: false, // true 為展示真實輸出圖片寬高 false 展示看到的截圖框寬高
        enlarge: 1, // 圖片根據截圖框輸出比例倍數
        mode: 'container', // 圖片默認渲染方式
        maxImgSize: 375,
        fixedNumber: [0.5, 1] // 數字不能大於 1
      },
      // 防止重複提交
      loading: false,
      preview: {},
      previewStyle: {}
    }
  },
  watch: {
    cropperOption: {
      handler (value) {
        this.option = Object.assign(this.option, value)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    cropResize () {
      switch (this.resize) {
      case 'fourThree':
        this.option.fixedNumber = [4, 3]
        this.option.autoCropWidth = this.cropperOption.autoCropWidth
        this.option.autoCropWidth = Math.round((this.cropperOption.autoCropHeight * 3) / 4)
        break
      case 'threeFour':
        this.option.fixedNumber = [3, 4]
        this.option.autoCropWidth = this.cropperOption.autoCropWidth
        this.option.autoCropWidth = Math.round((this.cropperOption.autoCropHeight * 4) / 3)
        break
      case 'oneOne':
        this.option.fixedNumber = [1, 1]
        this.option.autoCropWidth = this.cropperOption.autoCropWidth
        this.option.autoCropWidth = this.cropperOption.autoCropHeight
        break
      }
    },
    upload () { // 點擊上傳
      this.$refs.upload.value = null
      this.$refs.upload.click()
    },
    uploadImg (e) { // 上傳圖片
      let file = e.target.files[0]
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$message.error(file.name + '不是圖片格式文件')
        return false
      }
      if (file.size > 1024 * 1024 * this.fileSize) { // 图片不大于2M
        this.$message.error(`請上傳小於${this.fileSize}M的圖片`)
        return false
      }
      let reader = new FileReader()
      // 轉化為blob
      reader.readAsArrayBuffer(file)
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          // 把 Array Buffer 轉化為 blob 如果是 base64 不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.$set(this.option, 'img', data)
      }
    },
    realTime (preview) { // 實時預覽
      this.preview = preview
      this.previewStyle = {
        width: preview.w + 'px',
        height: preview.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: this.zoom
      }
    },
    // 將 base64 轉換為文件
    dataURLtoFile (dataurl, filename) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let len = bstr.length
      let u8arr = new Uint8Array(len)
      while (len--) {
        u8arr[len] = bstr.charCodeAt(len)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 將base64轉換為png文件圖片
    finish () {
      this.$refs.cropper.getCropData(data => {
        let file = this.dataURLtoFile(data, 'images.png')
        this.$emit('uploadCropper', file, data)
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.cropper-dialog  {
  & /deep/ .el-dialog{
    width: max-content;
  }
  & /deep/ .el-dialog__body {
    padding: 20px;
  }
  & /deep/ .el-button {
    width: 145px;
  }
}
.cropper-wrap{
  display: flex;
  .cropper-box{
    margin-right: 20px;
    width: 375px;
    height: 176px;
  }
  .preview-box{
    .preview-title {
      display: flex;
      min-width: 100px;
      justify-content: space-between;
      align-items: center;
      height: 32px;
      color: rgba(30,35,48,1);
      font-family: PingFangSC-Medium;
      .preveiw-upload {
        color: #0067ED;
        cursor: pointer;
      }
    }
    .preview-img{
      border-radius: 2px;
    }
  }
}
.fun-btn{
  margin-top: 16px;
  i{
    margin-right: 16px;
    font-size: 18px;
    color: #8c8c8c;
    cursor: pointer;
    &:hover{
      color: #0067ED;
    }
  }
  .reUpload{
    margin-right: 16px;
  }
}
</style>