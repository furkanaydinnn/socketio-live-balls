const colors = ['blue','green','red'];

const randomColor = ()=>{
    return colors[Math.random()*colors.length];
};

module.exports = randomColor;