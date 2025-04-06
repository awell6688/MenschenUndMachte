document.addEventListener('DOMContentLoaded', function() {
    // 创建弹出层
    const popup = document.createElement('div');
    popup.id = 'reference-popup';
    popup.style.display = 'none';
    popup.innerHTML = `
        <div class="reference-content">
            <div id="reference-text"></div>
            <button onclick="hideReference()">关闭</button>
        </div>
    `;
    document.body.appendChild(popup);

    // 获取所有带有reference-dot类的sup元素
    const referenceDots = document.querySelectorAll('sup.reference-dot');
    
    // 为每个引用标记添加点击事件监听器
    referenceDots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            const num = this.textContent;
            showReference(num, e);
        });
    });

    const references = {};
    document.querySelectorAll(".footnotes p").forEach((note, index) => {
        references[index + 1] = note.innerHTML.trim();
    });

    window.showReference = (element) => {
        const refId = element.getAttribute("data-ref");
        const refText = references[refId];
        if (refText) {
            const popup = document.getElementById("reference-popup");
            document.getElementById("reference-text").innerHTML = refText;

            // 设置弹出层居中显示
            popup.style.display = "flex";
        }
    };

    window.hideReference = () => {
        const popup = document.getElementById("reference-popup");
        popup.style.display = "none";
    };

    // 替换点击外部关闭功能
    document.addEventListener('click', function(event) {
        const popup = document.getElementById('reference-popup');
        const target = event.target;
        
        // 检查弹出层是否显示
        if (popup && popup.style.display === 'flex') {
            // 检查点击是否在弹出层或其子元素外部
            if (!popup.contains(target) && 
                !target.classList.contains('reference-dot') && 
                !target.closest('.reference-dot') && 
                !target.closest('.reference-content')) { // 确保检测到弹出层内容和引用标记
                hideReference();
            }
        }
    }, true); // 使用捕获阶段，确保事件优先处理
});

function showReference(num, event) {
    // 获取所有脚注内容
    const references = {};
    document.querySelectorAll('.footnotes li').forEach(li => {
        const text = li.textContent;
        const numMatch = li.id ? li.id.match(/fn(\d+)/) : null;
        if (numMatch) {
            const num = numMatch[1];
            // 移除序号和点号，只保留实际内容
            references[num] = text.replace(/^\d+\.\s*/, '').trim();
        }
    });

    // 显示弹出层
    const popup = document.getElementById('reference-popup');
    const referenceText = document.getElementById('reference-text');
    
    // 设置注释内容
    referenceText.textContent = references[num] || '未找到注释内容';
    
    // 计算弹出层位置
    const rect = event.target.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // 设置初始位置
    popup.style.position = 'fixed';
    popup.style.display = 'flex';
    
    // 获取弹出框的尺寸
    const popupRect = popup.getBoundingClientRect();
    
    // 计算位置，确保在视口内可见
    let top = (rect.top + rect.bottom) / 2 - popupRect.height / 2;
    let left = (rect.left + rect.right) / 2 - popupRect.width / 2;
    
    // 确保不超出视口边界
    if (top < 10) top = 10;
    if (top + popupRect.height > viewportHeight - 10) {
        top = viewportHeight - popupRect.height - 10;
    }
    if (left < 10) left = 10;
    if (left + popupRect.width > viewportWidth - 10) {
        left = viewportWidth - 10;
    }
    
    // 应用最终位置
    popup.style.top = top + 'px';
    popup.style.left = left + 'px';
}

function hideReference() {
    document.getElementById('reference-popup').style.display = 'none';
}
