<template>
  <div class="crop-upload">
    <h2>vue-cropper</h2>
    <div class="my-5">
      <div class="crop-upload-list">
        <ul class="el-upload-list el-upload-list--picture-card">
          <li
            v-for="(item, index) in fileList"
            :key="item.url"
            :tabindex="index"
            class="el-upload-list__item is-success"
          >
            <img
              :src="item.url"
              alt
              class="el-upload-list__item-thumbnail"
            >
            <a class="el-upload-list__item-name">
              <i class="el-icon-document" />
            </a>
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-check" />
            </label>
            <i class="el-icon-close" />
            <i class="el-icon-close-tip">按 delete 鍵可刪除</i>

            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="onEdit(index)"
              >
                <i class="el-icon-edit" />
              </span>
              <span
                class="el-upload-list__item-preview"
                @click="onPreview(item)"
              >
                <i class="el-icon-zoom-in" />
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="onRemove(index)"
              >
                <i class="el-icon-delete" />
              </span>
            </span>
          </li>
        </ul>
        <el-upload
          ref="upload"
          class="upload-demo"
          drag
          :action="uploadUrl"
          :auto-upload="false"
          :data="uploadData"
          :headers="headers"
          :limit="limit"
          :on-change="onChange"
          :on-exceed="onExceed"
          :show-file-list="false"
          list-type="picture-card"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <div
            slot="tip"
            class="el-upload__tip"
          >
            jpg/png files with a size less than 500kb
          </div>
        </el-upload>
        <!-- 			<el-upload
  				:action="uploadUrl"
  				:auto-upload="false"
  				:data="uploadData"
  				:headers="headers"
  				:limit="limit"
  				:on-change="onChange"
  				:on-exceed="onExceed"
  				:show-file-list="false"
  				list-type="picture-card"
  				ref="upload"
  			>
  				<i class="el-icon-plus"></i>
  			</el-upload> -->
      </div>
      <cropper
        ref="cropper"
        :visible.sync="cropperVisible"
        @on-cancel="onCropCancel"
        @on-finish="uploadImg"
      />
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img
        :src="dialogImageUrl"
        alt
        width="100%"
      >
    </el-dialog>
  </div>
</template>

<script>
import Cropper from '@/components/Cropper1.vue'

export default {
  components: {
    Cropper
  },
  props: {
    limit: {
      type: Number,
      default: 10
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      headers: {
        // your headers
      },
      uploadUrl: 'upload url',
      uploadData: {},
      dialogVisible: false,
      dialogImageUrl: '',
      cropperVisible: false,
      selectedCropIndex: -1
    }
  },
  computed: {
    upload () {
      return this.$refs.upload
    },
    cropper () {
      return this.$refs.cropper
    }
  },
  created () {},
  methods: {
    // 删除
    onRemove (index) {
      const newFileList = this.fileList
      newFileList.splice(index, 1)
      this.$emit('update:fileList', newFileList)
    },
    // 预览
    onPreview (item) {
      this.dialogImageUrl = item.url
      this.dialogVisible = true
    },
    // 弹出裁剪组件
    onEdit (index) {
      this.selectedCropIndex = index
      const file = this.fileList[index]
      this.cropper.show(file)
    },
    onExceed () {
      this.$message({
        type: 'error',
        message: '超出上传数量限制,无法继续上传'
      })
    },
    // 文件状态改变时的钩子，添加文件，弹出裁剪组件
    onChange (file, fileList) {
      this.cropper.show(file)
    },
    // 自定义上传方法
    uploadImg (file, data) {
      let fileFormData = new FormData()
      fileFormData.append('file', file)
      // 移除上传组件带来的bug
      // document.getElementsByTagName('body')[0].removeAttribute('style')
      this.cropperData.iconUrl = data
      this.showCropper = false
      // api.uploadFile(fileFormData, this).then(res => {
      //   this.cropperData.iconUrl = res
      //   this.showCropper = false
      //   this.$message({
      //     message: '操作成功',
      //     type: 'success'
      //   })
      // })
    },
    // 监听裁剪结束，进行上传
    onCropFinish (data) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.doUpload(data)
        .then(url => {
          // 更新对应 index 的 url
          const newFileList = this.fileList
          const item = { url }
          if (this.selectedCropIndex === -1) {
            newFileList.push(item)
          } else {
            newFileList[this.selectedCropIndex] = item
          }
          this.$emit('update:fileList', newFileList)
        })
        .finally(() => {
          this.reset()
          loading.close()
        })
    },
    // 取消裁剪
    onCropCancel () {
      this.reset()
    },
    doUpload (data) {
      // your custom upload
    },
    reset () {
      this.selectedCropIndex = -1
    }
  }
}
</script>

<style lang="css" scoped>
.crop-upload-list {
  display: flex;
}
</style>
