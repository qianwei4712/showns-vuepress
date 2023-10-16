import{_ as p,o as i,c as a,f as l}from"./app-831ad1c2.js";const n={},e=l('<p><strong>Java 三大特性：封装、继承、多态。</strong></p><h2 id="封装" tabindex="-1"><a class="header-anchor" href="#封装" aria-hidden="true">#</a> <span id="fengzhaung">封装</span></h2><p>封装是指一种将抽象性函式接口的实现细节部份包装、隐藏起来的方法。</p><p>封装其实就是访问控制，防止该类的代码和数据被外部类定义的代码随机访问。要访问该类的代码和数据，必须通过严格的接口控制。</p><p>封装最主要的功能在于：<strong>我们能修改自己的实现代码，而不用修改那些调用我们代码的程序片段。</strong></p><p>适当的封装可以让程式码更容易理解与维护，也加强了程式码的安全性。</p><p>封装的优点：</p><ol><li>减少耦合: 可以独立地开发、测试、优化、使用、理解和修改</li><li>减轻维护的负担: 使用封装方法，无需了解其实现细节，可以快速使用，并且调试过程中不影响其他封装方法</li><li>帮助有效地定位问题: 在整个系统流程中，可以快速查找哪个封装模块出现问题</li><li>提高系统的复用性</li></ol><br><h2 id="继承" tabindex="-1"><a class="header-anchor" href="#继承" aria-hidden="true">#</a> <span id="jicheng">继承</span></h2><p>继承是 java 面向对象编程技术的一块基石，因为它允许创建分等级层次的类。</p><p>继承就是子类继承父类的特征和行为，使得子类对象（实例）具有父类的实例域和方法，或子类从父类继承方法，使得子类具有父类相同的行为。</p><p>继承的特点：</p><ul><li>子类拥有父类非 private 的属性、方法。</li><li>子类可以拥有自己的属性和方法，即子类可以对父类进行扩展。</li><li>子类可以用自己的方式实现父类的方法。</li><li>Java 的继承是单继承，但是可以多重继承，单继承就是一个子类只能继承一个父类。</li><li>提高了类之间的耦合性（继承的缺点，耦合度高就会造成代码之间的联系越紧密，代码独立性越差）。</li></ul><br><h2 id="多态" tabindex="-1"><a class="header-anchor" href="#多态" aria-hidden="true">#</a> <span id="duotai">多态</span></h2><p>多态是同一个行为具有多个不同表现形式或形态的能力，例如：同一个接口，使用不同的实例而执行不同操作。</p><p>Java 中的多态主要指引用多态和方法多态。</p><blockquote><ol><li><p>引用多态是指：父类引用可以指向本类对象，也可指向子类对象。引用多态的强大主要体现在调用属性、方法时，可以根据引用具体指向的对象去调用，例如：子类中重写了父类方法。</p></li><li><p>方法多态：子类中可以重写父类的方法，在调用方法时根据引用指向的子类对象决定调用哪个具体的方法。方法多态的强大主要体现在可以根据调用时参数的不同，而自主匹配调用的方法，例如：重载。</p></li></ol></blockquote><p>多态的实现方式：</p><ol><li><p>重写</p></li><li><p>接口</p></li><li><p>抽象类</p></li></ol><p><strong>方法重写与重载的区别：</strong></p><p>​ 重写：一般发生在有继承关系的子类中，子类中定义了一个方法，其 <strong>方法名、返回值类型、参数列表</strong> 与父类中某个方法一样，此时就是子类中重写(覆盖)了父类的同名方法。</p><p>父类引用调用方法时，根据引用指向的对象决定调用父类定义的方法还是子类定义的方法，这体现了多态。</p><p>​ 重载：发生在同一个类中，存在 多个方法的<strong>方法名相同，但是参数列表不同</strong>。参数列表不同指的是<strong>参数个数、参数类型或者参数的顺序</strong>不同。</p><p>​ 调用方法时通过传递给它们的不同个数和类型的参数来决定具体使用哪个方法，这也体现了多态。</p>',26),o=[e];function r(t,s){return i(),a("div",null,o)}const h=p(n,[["render",r],["__file","EncapInheritPolymo.html.vue"]]);export{h as default};