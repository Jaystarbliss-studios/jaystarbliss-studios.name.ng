let data = {title: "A", description: "B", rewardCoins: 10};
let d = {id: "123"};
let isCompleted = false;
let html = `<div style="border:1px solid #eee; padding:15px; border-radius:8px; background:white;">
    <h4 style="margin-top:0;">${data.title}</h4>
    <p style="font-size:12px; color:#666;">${data.description}</p>
    <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:bold; color:#C9A84C;">+${data.rewardCoins} Coins</span>
        ${isCompleted ? 
            '<span style="color:green; font-weight:bold;">Completed</span>' : 
            `<button onclick="window.startQuiz('${d.id}')" style="background:var(--brand-primary); color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Start</button>`
        }
    </div>
</div>`;
console.log(html);
