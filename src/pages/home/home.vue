<template>
    <div class="home" >
    	<!-- <head-top signin-up='msite'>
    		<router-link :to="'/search/geohash'" class="link_search" slot="search">
	    		<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
	    			<circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none"/>
	    			<line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2"/>
	    		</svg>
    		</router-link>
			<router-link to="/home" slot="msite-title" class="msite_title">
				<span class="title_text ellipsis">{{msiteTitle}}</span>
			</router-link>
    	</head-top> -->
        <!-- 位置信息 -->
        <div class="location">
            <div class="address">
                <svg class="icon search-icon"> 
                        <use xlink:href="#ele_icon-shouhuodizhi"></use>
                </svg>
                <div class="ellipsis">富源大街和合大厦(富华中路)</div>
            </div>
        </div> 
        <!-- 搜索 -->
        <div class="search" :class="{fixed:searchScrollTop}" ref='search'> 
            <div class="search-input">
                <!-- <span>icon</span> -->
                <svg class="icon search-icon"> 
                    <use xlink:href="#ele_icon-sousuo"></use>
                </svg>
                <span>搜索商家、商品名称</span>
            </div>
        </div>
        <!-- 广告轮播 -->
        <div class="banner">
            轮播图
        </div>
        <!-- 服务类目 -->
    	<div class="msite_nav">
    		<div class="swiper-container" v-if="foodTypes.length">
		        <div class="swiper-wrapper">
		            <div class="swiper-slide food_types_container" v-for="(item, index) in foodTypes" :key="index">
	            		<router-link :to="{path: '/food', query: {geohash, title: foodItem.title, restaurant_category_id: getCategoryId(foodItem.link)}}" v-for="foodItem in item" :key="foodItem.id" class="link_to_food">
	            			<figure>
	            				<img :src="imgBaseUrl + foodItem.image_url">
	            				<figcaption>{{foodItem.title}}</figcaption>
	            			</figure>
	            		</router-link>
		            </div>
		        </div>
		        <div class="swiper-pagination"></div>
		    </div>
		    <img src="../../images/fl.svg" class="fl_back animation_opactiy" v-else>
    	</div>
        <!-- 超级会员 -->
        <div class="super-member">
            <div class="introduction">
                <span class="title">超级会员</span>
                <span>每月领20元红包</span>
            </div>
            <div class="open-member">
                <button>立即开通</button>
            </div>
        </div>
        <!-- special 品质联盟 -->
        <div class="special">
            <div class="items" v-for=" item in 3" :key='item'>
                <h2 class="title">品质联盟</h2>
                <p class="intro">搭配齐全吃得好</p>
                <img src="https://fuss10.elemecdn.com/e/7e/02b72b5e63c127d5bfae57b8e4ab1jpeg.jpeg" alt="暂无图片">
            </div>
        </div>
        <!-- adv 轮播 -->
        <div class="banner adv">
            轮播图
        </div>
        <!--  商家信息-->
    	<div class="shop_list_container">
	    	<div class="recommend"><span class="one">—&nbsp </span>推荐商家<span class="one"> &nbsp—</span></div>
            <sort-menu></sort-menu>
	    	<shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    	</div>
    	<foot-guide></foot-guide>
    </div>    
</template>

<script>
import {mapMutations} from 'vuex'
// import {imgBaseUrl} from 'src/config/env'
import headTop from 'src/components/EleHead.vue'
import footGuide from 'src/components/footer/footGuide'
import shopList from 'src/components/common/shoplist'
import sortMenu from 'src/components/common/SortMenu'
import {msiteAddress, msiteFoodTypes, cityGuess} from 'src/service/getData'
// import {} from 'src/plugins/swiper.min.js'
import 'src/style/swiper.min.css'

export default {
	data(){
        return {
        	geohash: '', // city页面传递过来的地址geohash
            msiteTitle: '请选择地址...', // msite页面头部标题
            foodTypes: [], // 食品分类列表
            hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
            imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
            searchScrollTop:false,
            
        }
    },
    async beforeMount(){
		if (!this.$route.query.geohash) {
			const address = await cityGuess();
			this.geohash = address.latitude + ',' + address.longitude;
		}else{
			this.geohash = this.$route.query.geohash
		}
		//保存geohash 到vuex
		this.SAVE_GEOHASH(this.geohash);
    	//获取位置信息
    	let res = await msiteAddress(this.geohash);
    	this.msiteTitle = res.name;
    	// 记录当前经度纬度
    	this.RECORD_ADDRESS(res);

    	this.hasGetData = true;
    },
    mounted(){
        window.addEventListener('scroll', this.handleScroll)
        console.log('>>>>>>>>>>>>>',this.$refs.search)
        //获取导航食品类型列表
       	msiteFoodTypes(this.geohash).then(res => {
       		let resLength = res.length;
       		let resArr = [...res]; // 返回一个新的数组
       		let foodArr = [];
    		for (let i = 0, j = 0; i < resLength; i += 8, j++) {
    			foodArr[j] = resArr.splice(0, 8);
    		}
    		this.foodTypes = foodArr;
        }).then(() => {
        	//初始化swiper
        	new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        loop: true
            });
            
        })
    },
    components: {
    	headTop,
    	shopList,
        footGuide,
        sortMenu
    },
    computed: {
        // searchScrollTop:function(){
        //     // console.log('>>>>>>>>>>>>>',this.$refs.home.scrollTop)
        //     // return this.$refs.home.scrollTop
        // }

    },
    methods: {
    	...mapMutations([
    		'RECORD_ADDRESS', 'SAVE_GEOHASH'
    	]),
    	// 解码url地址，求去restaurant_category_id值
    	getCategoryId(url){
    		let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''));
    		if (/restaurant_category_id/gi.test(urlData)) {
    			return JSON.parse(urlData).restaurant_category_id.id
    		}else{
    			return ''
    		}
        },
        handleScroll(){
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            let htmlFontSize = document.documentElement.style.fontSize.replace('px','');
            //rem精确处理 2rem
            if((scrollTop/htmlFontSize)>2){
                this.searchScrollTop = true;
            }else{
                this.searchScrollTop = false;
            }
        }
        
    },
    watch: {

    },
    // beforeRouteEnter(){
    //     next();
    // },


}

</script>

<style lang="scss" scoped>
    // @import 'src/style/swiper.min.css';
    @import 'src/style/mixin';
    .home{
        @include sc(0.8rem);
        background-color: #fff;
        .location{
            padding:0.2rem 0.8rem;
            background-color: #3190e8;
            @include wh(100%,2rem);
            
            .address{
                // @include sc(0.6rem);
                @include fdaj(row,flex-start,);
                width:60%;
                height:100%;
                div{
                    // line-height:100%;
                    @include sc(0.8rem);
                    text-overflow: ellipsis;
                }
            }
            .search-icon{
                    margin-top: 0.05rem;
                    align-self:center;
                    fill: #fff;
                    margin-right: 0.3rem;
                    @include wh(0.9rem, 0.9rem);
                }
            
        }
        .search{
            background-color: #3190e8;
            @include wh(100%,2.5rem);
            padding:0.4rem 0.8rem;
            .search-input{
                @include sc(0.6rem,#999);
                @include fdaj(row,center,);
                height:100%;
                background-color: #fff;
                .search-icon{
                    fill: #333;
                    margin-right: 0.3rem;
                    vertical-align: middle;
                    @include wh(0.7rem, 0.7rem);
                }
            }
        }
        .search.fixed{
            transition: all .1s ease 0;
            position: fixed;
            top:0;
            left:0;
            z-index: 1000;
        }
        .banner{
            @include sc(0.8rem);
            height:5rem;
        }
        .super-member{
            // width:100%;
            height:2rem;
            margin:  0.2rem 0.5rem;
            @include sc(0.5rem);
            @include fdaj();
            padding : 0 0.5rem 0 1rem;
            background-color: #fff930;

        }
        .special{
            margin:  0 0.5rem;
            @include fdaj();
            
            .items{
                width:32%;
                min-height:6.5rem;
                padding-top: 0.6rem;
                background: #eee;
                @include sc(0.5rem);
                text-align: center;
                .title{
                    @include sc(0.8rem,#333);
                    font-weight: 700;
                }
                .intro{
                    border:1px solid #999;
                    @include sc(0.6rem,#999);
                    margin: 0.25rem 0.25rem;
                }
                img{
                    @include wh(100%,5rem)
                }
            }

        }
        .shop_list_container{
            .recommend{
                text-align: center;
                @include sc(0.8rem,#333);
                .one{
                    color:#999;
                }
            }
            
        }
    }
	.link_search{
		left: .8rem;
		@include wh(.9rem, .9rem);
		@include ct;
	}
	.msite_title{
		@include center;
        width: 50%;
        color: #fff;
        text-align: center;
        margin-left: -0.5rem;
        .title_text{
            @include sc(0.8rem, #fff);
            text-align: center;
            display: block;
        }
	}
	.msite_nav{
		// padding-top: 2.1rem;
		background-color: #fff;
		// border-bottom: 0.025rem solid $bc;
		// height: 10.6rem;
		.swiper-container{
			@include wh(100%, auto);
			padding-bottom: 0.6rem;
			.swiper-pagination{
				bottom: 0.2rem;
			}
		}
		.fl_back{
			@include wh(100%, 100%);
		}
	}
	.food_types_container{
		display:flex;
		flex-wrap: wrap;
		.link_to_food{
			width: 25%;
			padding: 0.3rem 0rem; 
			@include fj(center);
			figure{
				img{
					margin-bottom: 0.3rem;
					@include wh(1.8rem, 1.8rem);
				}
				figcaption{
					text-align: center;
					@include sc(0.55rem, #666);
				}
			}
		}
	}
	.shop_list_container{
		margin-top: .4rem;
		// border-top: 0.025rem solid $bc;
		background-color: #fff;
		.shop_header{
			.shop_icon{
				fill: #999;
				margin-left: 0.6rem;
				vertical-align: middle;
				@include wh(0.6rem, 0.6rem);
			}
			.shop_header_title{
				color: #999;
				@include font(0.55rem, 1.6rem);
			}
		}
	}

</style>

