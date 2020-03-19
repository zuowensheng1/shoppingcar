
function tab(box){
    let cartBtn = box.querySelector('.cartIconBox');
    let goodsBox = box.querySelector('.goodsBox');
    let cartListBox = box.querySelector('.cartListBox');
    console.log(cartBtn);

    cartBtn.onclick = function(){
        //console.log(666);
        //让购物车列表显示
        cartListBox.classList.remove('hide');
        //商品列表隐藏
        goodsBox.classList.add('hide');
        cartBtn.classList.add('hide');
        //进入购物车列表页之后，再去执行这个业务的逻辑
        cartListFn();
    }

    //实现点击返回按钮  回到商品列表页
    let backBtn = document.querySelector(".back");

    backBtn.onclick = function(){
        cartListBox.classList.add("hide");
        goodsBox.classList.remove("hide");
        cartBtn.classList.remove('hide');
        //进入商品列表，刷新
        updateCount();
    }

    function tabFn(){
        let tabs = box.querySelectorAll('.tabBox ul li');
        for(let i=0;i<tabs.length;i++){
            
            tabs[i].onclick=function(){
                clearClass(tabs);
                tabs[i].classList.add('current');
                //getData(i);
                renderGoods2(i);
                //goodsList[i].classList.remove("hide");
            }
        }
    }

    function clearClass(tabs){
        for(let i=0;i<tabs.length;i++){
            tabs[i].classList.remove('current');
            //goodsList[i].classList.add("hide");
        }
    }

    function renderGoods(data){
        //字符串拼接    然后利用innerHTML进行渲染
        let str = "";
        data.forEach(item => {
            str += `<li>
            <div class="imgBox">
                <img src="${item.img}" alt="">
            </div>
            <h3 class="til">${item.til}</h3>
            <div class="btn">加入购物车</div>
        </li>`;
            
        });
    
        let ul = document.querySelector(".goodsList ul");
        ul.innerHTML = str;
        return new Promise((resolve,rejects)=>{
            resolve(data);
        });
    }
    
    function getData2(i){
        return new  Promise((resolve,rejects)=>{
            let xhr =  new XMLHttpRequest();
            xhr.open("get",`./data/${i+1}.json`);//用get的方式去./1.json的路径请求数据
            xhr.onreadystatechange = function(){
                //随时监听  请求的状态
                if(xhr.status == 200 && xhr.readyState == 4){
                    let data = JSON.parse(xhr.response);
                    resolve(data);
                }
            }
            xhr.send();//发送
        });
    }

    function updateCount(){
        let countBox = box.querySelector(".cartIconBox .numBox");
        let str = localStorage.getItem('carList');
        let ary = str? JSON.parse(str):[];
        // console.log(ary);
        let count = 0;
        count = ary.reduce(function(prev, next){
            return prev + next.count;
        }, 0)
        //console.log(count);
        countBox.innerHTML = count;
    }
    
    function bindAdd(data){
        //绑定加入购物车的点击事件
        let addBtns = box.querySelectorAll(".goodsBox .goodsList .btn")
        //console.log(addBtns);
        
        
        for(let i=0;i<addBtns.length;i++){
            addBtns[i].onclick = function(){
                let str= localStorage.getItem('carList');
                let ary = str? JSON.parse(str): [];
                let bol= ary.some(function(item){
                    if(item.id === data[i].id){
                        item.count++;
                        return true;
                    }   
                })
                if(!bol){
                    data[i].count = 1;
                    data[i].checked = true; 
                    ary.push(data[i]);
                }
                localStorage.setItem('carList', JSON.stringify(ary));
                updateCount();
            }
        }
    }

    function renderGoods2(i){
        getData2(i).then(renderGoods).then(bindAdd)
    }
    tabFn();
    renderGoods2(0);
    updateCount();
}
tab(box);

function cartListFn(){
    //专门处理购物车列表的逻辑
    function renderCartList(){
        //用来渲染购物车列表的数据
        let str = localStorage.getItem('carList');
        let ary = str ? JSON.parse(str) : [];
        //console.log(ary);
        let ul = document.querySelector(".cartListBox .goodsListBox");
        let html = "";
        ary.forEach(function(item){
            html += `<li>
            <div class="checkBox">
                <input type="checkbox" ${item.checked ? 'checked' : ''}>
            </div>
            <div class="imgBox">
                <img src="${item.img}"/>
            </div>
            <div class="contentBox">
                <div class="title">${item.til}</div>
                <div class="desc">${item.desc}</div>
                <div class="priceCountBox">
                    <span>价格：￥${(item.price/100).toFixed(2)}</span>
                    数量:
                    <input type="number" min=0 value=${item.count} >
                </div>
            </div>
            <button class="delBtn" >删除</button>
        </li>`;
        });
        ul.innerHTML = html;
        bindCheck();//绑定change事件
        bindChangeCount();
        checkAll();
        bindDelBtn();
    }
    function bindCheck(){
        let inputs= document.querySelectorAll('.goodsListBox li .checkBox input');
        for(let i=0;i<inputs.length;i++){
            inputs[i].onchange = function(){
                //console.log(this.checked);
                //获取到最新的状态之后，要更新到localStorage
                let ary = JSON.parse(localStorage.getItem('carList'));
                ary[i].checked = this.checked;
                localStorage.setItem('carList',JSON.stringify(ary));
                checkAll();
            }
        }
    }
    function bindChangeCount(){
        let inputs= document.querySelectorAll('.goodsListBox li .contentBox input');
        for(let i=0;i<inputs.length;i++){
            inputs[i].oninput = function(){
                //console.log(this.value);
                //获取到最新的状态之后，要更新到localStorage
                let ary = JSON.parse(localStorage.getItem('carList'));
                ary[i].count = this.value/1;
                localStorage.setItem('carList',JSON.stringify(ary));
                checkAll();
            }
        }
    }
    function checkAll(){
        //处理全选部分的逻辑
        let allCheckBox = document.querySelector('.totalBox input');
        let totalMoney = document.querySelector('.totalBox .money');
        let ary =  JSON.parse(localStorage.getItem('carList'));
        let bol = ary.every(function (item){
            return item.checked;
        })
        allCheckBox.checked = bol;
        allCheckBox.onchange = function(){
            let inputs= document.querySelectorAll('.goodsListBox li .checkBox input');
            ary.forEach(function(item){
                item.checked = allCheckBox.checked;
            })
            localStorage.setItem('carList',JSON.stringify(ary));
            renderCartList();
            // inputs.forEach(function(item){
            //     item.checked = allCheckBox.checked;
            // })
        }
        let t =0;
        console.log(ary);
        ary.forEach(function(item){
            if(item.checked){
                t += item.price * item.count;
            }    
        })
        
        totalMoney.innerHTML = (t/100).toFixed(2);
    }
    function bindDelBtn(){
        let delBtns = document.querySelectorAll(".cartListBox .goodsListBox .delBtn");
        for(let i=0;i<delBtns.length;i++){
            delBtns[i].onclick = function(){
                let ary = JSON.parse(localStorage.getItem('carList'));
                ary.splice(i,1);
                localStorage.setItem('carList',JSON.stringify(ary));
                renderCartList();
            }
        }
        
    }
    renderCartList();
}