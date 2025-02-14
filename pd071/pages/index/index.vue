<template>
	<view class="container">
		<!-- 顶部欢迎语 -->
		<view class="welcome">
			<text class="title">欢迎使用平德管理系统</text>
			<text class="subtitle">请选择您要进入的模块</text>
		</view>
		
		<!-- 模块导航 -->
		<view class="nav-grid">
			<!-- 供应商门户 -->
			<view class="nav-item" @tap="navTo('/pages/supplier/index')">
				<view class="icon-wrapper supplier">
					<image src="/static/supplier.png" mode="aspectFit"></image>
				</view>
				<text class="label">供应商门户</text>
			</view>
			
			<!-- 生产部门 -->
			<view class="nav-item" @tap="navTo('/pages/production/index')">
				<view class="icon-wrapper production">
					<image src="/static/production.png" mode="aspectFit"></image>
				</view>
				<text class="label">生产部门</text>
			</view>
			
			<!-- 品控部门 -->
			<view class="nav-item" @tap="navTo('/pages/quality/index')">
				<view class="icon-wrapper quality">
					<image src="/static/quality.png" mode="aspectFit"></image>
				</view>
				<text class="label">品控部门</text>
			</view>
			
			<!-- 管理后台 -->
			<view class="nav-item" @tap="navTo('/pages/admin/index')">
				<view class="icon-wrapper admin">
					<image src="/static/admin.png" mode="aspectFit"></image>
				</view>
				<text class="label">管理后台</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad() {

		},
		methods: {
			navTo(url) {
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		padding: 40rpx;
		background: #f5f7fa;
	}

	.welcome {
		margin-bottom: 60rpx;
		
		.title {
			display: block;
			font-size: 40rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 16rpx;
		}
		
		.subtitle {
			font-size: 28rpx;
			color: #666;
		}
	}

	.nav-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 30rpx;
		padding: 20rpx 0;
		
		.nav-item {
			background: #fff;
			border-radius: 16rpx;
			padding: 40rpx 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
			transition: all 0.3s;
			
			&:active {
				transform: scale(0.95);
			}
			
			.icon-wrapper {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 20rpx;
				
				image {
					width: 60%;
					height: 60%;
				}
				
				&.supplier {
					background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
				}
				
				&.production {
					background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
				}
				
				&.quality {
					background: linear-gradient(135deg, #faad14 0%, #d48806 100%);
				}
				
				&.admin {
					background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
				}
			}
			
			.label {
				font-size: 32rpx;
				color: #333;
				font-weight: 500;
			}
		}
	}
</style>
