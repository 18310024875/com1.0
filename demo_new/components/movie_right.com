<template>
	<div class="movie_right">
		<ul class="box">
			<li v-for="(v,k) in list" >
				<div class="fen">
					<span></span>
					<i></i>
				</div>
				<div class="fl"> 
					<img v-bind:src="v.poster.origin"/>
				</div>
				<div class="fr"> 
					<p class="p1">{{v.name}}</p>
					<p class="p2">{{v.intro}}</p>
					<div clas="div2">
						<div>
							<span>{{v.day}}</span>
							上映
						</div>
						<div>
							<span>{{v.week}}</span>								
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
	
	Com.exports = {
		components:{

		},
		data:{
			page:0,
			load:null,
			list:[]
		},

		mounted(){
			var this_ = this ;
			setTimeout(function(){
				var dom = $('.appScroll').get(0) ;
				this_.load = $load(dom,function(){
					this_.getList() ;
				})
			},300);
		},
		updated:function(){
			this.load.once=true;
		},
		beforeDestroy:function(){
			if( this.load ){
				this.load.destroy()
			}
		},
		methods:{
			time(shijianchuo){
				//shijianchuo是整数，否则要parseInt转换
				var time = new Date(shijianchuo);
				var y = time.getFullYear();
				var m = time.getMonth()+1;
				var d = time.getDate();
				var h = time.getHours();
				var mm = time.getMinutes();
				var s = time.getSeconds();
				var week ;
				 switch (time.getDay()) {
				  case 0:week="星期天";break
				  case 1:week="星期一";break
				  case 2:week="星期二";break
				  case 3:week="星期三";break
				  case 4:week="星期四";break
				  case 5:week="星期五";break
				  case 6:week="星期六";break
				 }
				//return y+'-'+m+'-'+d+' '+h+':'+mm+':'+s+week;
				return {
					day:m+'月'+d+'日',
					week:week
				}
			},
			getList:function(){
				var this_ = this ;
				var page = this.page ;
					page++ ;
				//即将上映
				$get('will'+page+'.json',function(res){
					if(res.data.films.length==0){
						alert('没有数据了') ;return;
					}
					var list = res.data.films ;
					list = list.map(function(v){
						var obj = this_.time(v.premiereAt) ;
						v.day = obj.day ;
						v.week = obj.week ;
						return v
					})
					this_.list = this_.list.concat(res.data.films) ;

					this_.load.once = false ;
					this_.setState() ;
				});
			}
		}
	}
</script>
<style lang="less">
	.box{
		li{
			border-bottom: dashed 1px #c9c9c9;
			padding: .4rem 0;
			overflow: hidden;
			position: relative;
			&>div{
				float: left;
			}
			.fl{
				width: 1.2rem;
				height: 1.64rem;
				overflow: hidden;
				img{
					width: 100%;
					height: 100%;						
				}
			}
			.fr{
				margin-left: .27rem;
				color: #8e8e8e;
				p{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 3.3rem;
				}
				.p1{
					font-size: .3rem;
					color: #000;
					margin-top: .1rem;
				}
				.p2{
					margin-top: .18rem;
				}
				.div{
					margin-top: .23rem;
					width: 3.6rem;
					overflow: hidden;
					div:nth-of-type(1){
						float: left;
					}
					div:nth-of-type(2){
						float: right;
					}
					span{
						color: #8aa2bf;
					}
				}
				.div2{
					margin-top: .23rem;
					overflow: hidden;
					color: #ffb375;	
					div{
						float: left;
						margin-right: 0.3rem;							
					}					
				}
			}
		}
		.fen{
			position: absolute;
			right: .33rem;
			top: .48rem;
			color: #fc7103;
			font-size: .32rem;	
			i{
				display: inline-block;
				width: .13rem;
				height: .13rem;
				border: 1px solid #999;
				opacity: .6;
				position: relative;
				top: -1px;
				transform: rotate(45deg);
				border-left: none;
				border-bottom: none;
			}			
		}
	}
</style>