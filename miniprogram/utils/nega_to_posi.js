function main(options_num, options_arr, person_num) {
    // console.log(arguments)
	return iter(options_num, person_num, options_arr)
}

function init (options_arr) {

}

function generateNS (options_num, options_arr) {
	let r = []
    for(let i=0;i<options_num;i++) r[i]=0;
    for(let i=0;i<options_num;i++)
    {
        for(let j=0;j<options_arr[i];j++)
        {
            let temp=Math.floor(Math.random()*100)%(options_num-1);
            // console.log(temp)
            if(temp>=i)
            {
                r[temp+1]++;
            }
            else r[temp]++;
        }
    }
    // console.log("Neg Service:")
    return r
}

function NStoPS(options_num, t)  //第一种negative survey向正调查转换，太过简单，不考虑 
{
    for(let i=0;i<options_num;i++)
    {
        t[i]=n-(options_num-1)*r[i];
    }
    console.log("NStoPS")
    for(let i=0;i< options_num;i++)
    {
        console.log(t[i]);
    }
}

function NStoPSII(options_num, person_num, r)    //第二种转换方法 
{
    let flag = [], t = [];
    for(let i=0;i<options_num;i++)
    {
        t[i]=person_num-(options_num-1)*r[i];
        flag[i]=true;
    }
    let tN=person_num;
    let tc=options_num;
    while(true)      //对于小于0的分布进行置0处理 
    {
        let i
        for(i=0;i<options_num;i++)
        {
            if(t[i]<0) break;
        }
        if(i==options_num) break;
        for(let i=0;i<options_num;i++)
        {
            if(t[i]<0)
            {
                t[i]=0;
                flag[i]=false;
                tN=tN-r[i];
                tc=tc-1;
            }
        }
        for(let i=0;i<options_num;i++)
        {
            if(flag[i]==true)
            {
                t[i]=tN-(tc-1)*r[i];
                t[i]=t[i]*person_num/tN;
            }
        }
    }
    let p = 0;
    let tn = person_num;
    let _t = []
    for(let i=0;i<options_num;i++)    //对数据进行误差处理 
    {
        _t[i] = Math.floor(t[i]+0.5);
        if(flag[i])
        {
            p = i;
        }
        tn-=_t[i];
    }
    _t[p] += tn;
    // console.log("NII:")
    return _t
}

function NStoPS_BK(option_nums, person_num, t, r)  //结合了背景考虑的负调查向正调查转换方法，本次实验不考虑 
{
    let flag = [];
    for(let i=0;i<option_nums;i++)
    {
        flag[i]=true;
        t[i]=person_num-(option_nums-1)*r[i];
    }
    let act=true;
    let n1=person_num;
    while(act)
    {
        let s=0;
        act=false;
        let n2=n1;
        for(let i=0;i<c;i++)
        {
            if(flag[i])
            {
                if(low[i]>t[i])
                {
                    flag[i]=false;
                    n1=n1-low[i];
                    n2=n2-t[i];
                    t[i]=low[i];
                    act=true;
                }
                else if(t[i]>up[i])
                {
                    flag[i]=false;
                    n1=n1-up[i];
                    n2=n2-t[i];
                    t[i]=up[i];
                    act=true;
                }

            }
        }
        for(let i=0;i<c;i++)
        {
            if(flag[i] &&(n2!=0))
                t[i]=t[i]*n1/n2;
        }
    }

    let tn=n;
    let p=0;
    for(let i=0;i<c;i++)
    {
        _t[i] = int(t[i]+0.5);
        if(flag[i])
            p=i;
        tn-=_t[i];
    }
    _t[p] += tn;

    // for(int i=0;i<c;i++)
    // {
    //     printf("%d ",_t[i]);
    // }
    // printf("\n");

}

function iter (options_num, person_num, options_arr) {
    // let iterN = 10, acc = acc1 = acc2 =  0;
    // let t_pie = [], t_pie2 = [], t_hat = [], t = [], r = []
    // for(let i=0;i<iterN;i++) {
        // r = generateNS(options_num, options_arr);
        // NStoPS(t_pie);
        let t = NStoPSII(options_num, person_num, options_arr);
        // bl(t_pie2)
        // NStoPS_BK(t_hat);
    //     let temp_acc = temp_acc1 = temp_acc2 = 0;;    //此类acc变量不需要出现在初赛中，此为误差评判变量
    //     for(j = 0;j<options_num;j++)
    //     {
    //         temp_acc+=(t[j]-t_hat[j])*(t[j]-t_hat[j]);
    //         temp_acc1+=(t[j]-t_pie[j])*(t[j]-t_pie[j]);
    //         temp_acc2+=(t[j]-t_pie2[j])*(t[j]-t_pie2[j]);
    //     }
    //     acc+=Math.sqrt(temp_acc)/iterN;
    //     acc1+=Math.sqrt(temp_acc1)/iterN;
    //     acc2+=Math.sqrt(temp_acc2)/iterN;
    //     // console.log("accuracy:", acc, acc1, acc2)
    // }
    console.log(t)
    return t
}


function bl (arr) {
	for (let i = 0; i < arr.length; i++) {
		console.log(arr[i])
	}
}
// main(3, [300, 200, 30], 500)
module.exports = main;