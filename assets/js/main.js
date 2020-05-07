var eventBus = new Vue()
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: ` 
    <div>

        <!-- Product adding and information -->
        <div class="product">
            <div class="product-image">
                <img :src="image" :alt="altText">
            </div>
            <div class="product-info">
                <h2>{{ title }}</h2>
                <p v-if="inStock > 10">In Stock</p>
                <p v-else-if="inStock <= 10 && inStock >0">Almost sold</p>
                <p v-else>Out of Stock</p>
                <p>Shipping: {{shipping}}</p>
                <ul>
                    <li v-for="detail in details"> {{detail}}

                    </li>
                </ul>
                <div v-for="(variant, index) in variants" class="color-box" :key="variant.variantID" :style="{backgroundColor:variant.variantColor}" @mouseover="updateProduct(index)">
                </div>
                <button @click='addToCart' :class="{disabledButton : !inStock}">Add to cart</button>
            </div>

        </div>  
        
       <product-tabs :reviews="reviews"></product-tabs>
       
    </div>
        `,
    data() {
        return {
            product: "Socks",
            selectedVariant: 0,
            altText: 'A pair of Socks',
            inventory: 20,
            details: ["99% cotton", "Gender Neutral", "Varous Color"],
            variants: [{
                    variantID: 2010,
                    variantColor: "#1dd1a1",
                    variantImage: "./assets/images/green.jpg",
                    variantQuantity: 21
                },
                {
                    variantID: 2013,
                    variantColor: "#5f27cd",
                    variantImage: "./assets/images/blue.jpg",
                    variantQuantity: 7

                },
                {
                    variantID: 2015,
                    variantColor: "#10ac84",
                    variantImage: "./assets/images/puma.jpg",
                    variantQuantity: 0

                }
            ],

            brand: "Nike",
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantID)
        },
        updateProduct(index) {
            this.selectedVariant = index

        },


    },
    computed: {
        title() {
            return this.brand + " " + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "free"
            } else {
                return "2.99$"
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
    <b> Please correct the following error(s)</b>
    <ul>
    <li v-for ="error in errors"> {{error}}</li>
    </ul>
    </p>
    <p>
    <label for='name'>Name: </label>
    <input id="name" v-model="name">
    </p>
    
    <p>
    <label for='review'>review: </label>
    <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
    <label for='rating'>rating: </label>
    <select id="rating" v-model.number="rating">

    <option>1</option>
    <option>2</option>
    <option>3</option>
    <option>4</option>
    <option>5</option>
</select>
    
    </p>
    
    <p>
    <input type="submit" value="Submit">
    </p>
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []

        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,

                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null

            } else {
                if (!this.name) {
                    this.errors.push("Name required.")
                }
                if (!this.review) {
                    this.errors.push("Review required.")
                }
                if (!this.rating) {
                    this.errors.push("Rating required.")
                }
            }


        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
        <span class="tab" :class="{activeTab:selectedTab === tab}" v-for="(tab,index) in tabs" :key="index"
    @click="selectedTab=tab">{{ tab }}</span>

    <div v-show="selectedTab === 'Reviews'">
    <h2>Reviews</h2>
    <p v-if="!reviews.length">There are no reviews yet.</p>
<ul>
    <li v-for="review in reviews"> <p>Name: {{review.name}}</p> 
        <p>Review: {{review.review}}</p> 
        <p>Rating: {{review.name}}</p> 
    </li>
</ul>
</div>
<product-review  v-show="selectedTab === 'Make a Review'" ></product-review>
    </div>
    `,
    data() {
        return {
            tabs: ["Reviews", "Make a Review"],
            selectedTab: "Reviews"
        }
    }
})
var app = new Vue({
    el: "#app",
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }

})