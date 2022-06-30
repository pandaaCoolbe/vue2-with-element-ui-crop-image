<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      title="圖片裁剪"
      width="800px"
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
      <div
        v-show="!showPreview"
        class="crop-container"
      >
        <div class="crop-box">
          <vue-cropper
            ref="cropper"
            :fixed-number="cropperOption.fixedNumber"
            :auto-crop="cropperOption.autoCrop"
            :auto-crop-height="cropperOption.autoCropHeight"
            :auto-crop-width="cropperOption.autoCropWidth"
            :can-move="cropperOption.canMove"
            :can-move-box="cropperOption.canMoveBox"
            :can-scale="cropperOption.canScale"
            :center-box="cropperOption.centerBox"
            :enlarge="cropperOption.enlarge"
            :fixed-box="cropperOption.fixedBox"
            :fixed="cropperOption.fixed"
            :full="cropperOption.full"
            :high="cropperOption.high"
            :img="cropperOption.img"
            :info="true"
            :info-true="cropperOption.infoTrue"
            :limit-min-size="cropperOption.limitMinSize"
            :max-img-size="cropperOption.maxImgSize"
            :mode="cropperOption.mode"
            :original="cropperOption.original"
            :output-size="cropperOption.size"
            :output-type="cropperOption.outputType"
            @cropMoving="onCropMoving"
            @imgLoad="onImgLoad"
            @realTime="onRealTime"
          />
        </div>
        <div class="crop-action">
          <el-button
            type="primary"
            @click="onConfirm"
          >
            確 定
          </el-button>
          <el-button @click="showPreview = true">
            預 覽
          </el-button>
          <el-button @click="onCancel">
            取 消
          </el-button>
        </div>
      </div>
      <div
        v-show="showPreview"
        class="crop-container"
      >
        <div
          :style="previews.div"
          class="crop-preview"
        >
          <img
            :src="previews.url"
            :style="previews.img"
            alt
          >
        </div>
        <div class="crop-action">
          <el-button
            type="primary"
            @click="onConfirm"
          >
            確 定
          </el-button>
          <el-button @click="showPreview = false">
            取消預覽
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  name: 'CropperUpload',
  components: {
    VueCropper
  },
  data () {
    return {
      visible: false,
      previews: {},
      showPreview: false,
      crap: false,
      resize: '',
      cropperOption: {
        img: '',
        size: 1, // 輸出圖片壓縮比, 默認 1
        full: false, // 是否輸出原圖比例的截圖
        infoTrue: false, // 截圖信息展示是否時真實的輸出寬高
        outputType: 'png',
        canScale: true, // 是否開啟滾輪縮放大小
        canMove: true, // 能否拖動圖片
        canMoveBox: false, // 能否拖動截圖框
        fixed: true, // 固定寬高比
        fixedBox: true, // 截圖框固定大小
        original: false, // 上傳圖片時，是否顯示原始寬高
        autoCrop: true, // 是否自動生成截圖框
        // 只有自動截圖開啟 寬度高度才生效
        autoCropWidth: 200,
        autoCropHeight: 200,
        centerBox: true, // 截圖框是否限制在圖片裡(只有在自動生成截圖框時才生效)
        high: false, // 是否根據 dpr 生成適合屏幕的高清圖片
        cropData: {},
        enlarge: 1, // 按照截圖框比例輸出，默認 1
        mode: 'contain', // 圖片的默認渲染方式
        maxImgSize: 2000, // 上傳圖片時圖片最大大小(默認會壓縮尺寸到這個大小)
        limitMinSize: [200, 200], // 截圖框最小限制
        fixedNumber: [0.5, 1] // 數字不能大於 1
      }
    }
  },
  computed: {
    cropper () {
      return this.$refs.cropper
    }
  },
  watch: {
  },
  methods: {
    cropResize () {
      switch (this.resize) {
      case 'fourThree':
        this.cropperOption.fixedNumber = [4, 3]
        break
      case 'threeFour':
        this.cropperOption.fixedNumber = [3, 4]
        break
      case 'oneOne':
        this.cropperOption.fixedNumber = [1, 1]
        break
      }
    },
    show (file) {
      this.cropperOption.img = file.url
      this.$nextTick(() => {
        this.visible = true
      })
    },
    hide () {
      this.visible = false
    },
    // 實時預覽函數
    // data 中保存了需要預覽的樣式及 url，直接用就行了
    onRealTime (data) {
      // console.log('onRealTime -> data', data);
      this.previews = data
    },
    onImgLoad (msg) {
      console.log('onImgLoad -> msg', msg)
      // 圖片加載完成後，獲取圖片的真實寬高
      // 以最小的那個值作為裁剪框默認大小
      const { trueWidth, trueHeight } = this.cropper
      const width = Math.min(trueWidth, trueHeight)
      this.cropperOption.autoCropWidth = width
      this.cropperOption.autoCropHeight = width
    },
    onCropMoving (data) {
      this.cropperOption.cropData = data
    },
    onConfirm () {
      // 獲取裁剪後的 blob 數據，傳遞到外部
      this.$refs.cropper.getCropBlob(blob => {
        console.log('crop onConfirm -> blob', blob)
        this.hide()
        this.$emit('on-finish', blob)
      })
    },
    onCancel () {
      this.hide()
      this.$emit('on-cancel')
    }
  }
}
</script>

<style lang="css" scoped>
.crop-container {
  display: flex;
  align-items: center;
}
.crop-box {
  margin: 0 auto;
  width: 700px;
  height: 600px;
}
.crop-preview {
  margin: auto;
  border: 1px dotted #e4e4e4;
  overflow: hidden;
}
.crop-action {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-button {
  width: 98px;
  margin-bottom: 20px;
  margin-left: 10px;
}
</style>
