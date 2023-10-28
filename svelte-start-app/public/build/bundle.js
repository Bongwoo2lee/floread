
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.58.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Floread.svelte generated by Svelte v3.58.0 */

    const { Error: Error_1, console: console_1 } = globals;
    const file = "src/Floread.svelte";

    function create_fragment(ctx) {
    	let body;
    	let div0;
    	let button0;
    	let p0;
    	let t1;
    	let div1;
    	let p1;
    	let t3;
    	let p2;
    	let t5;
    	let div2;
    	let p3;
    	let b;
    	let t7;
    	let table0;
    	let tr0;
    	let td0;
    	let img0;
    	let img0_src_value;
    	let t8;
    	let td1;
    	let img1;
    	let img1_src_value;
    	let t9;
    	let td2;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let tr1;
    	let td3;
    	let button1;
    	let t12;
    	let td4;
    	let button2;
    	let t14;
    	let td5;
    	let button3;
    	let t16;
    	let div7;
    	let div6;
    	let table1;
    	let tr2;
    	let td6;
    	let button4;
    	let svg0;
    	let path0;
    	let t17;
    	let tr3;
    	let td7;
    	let div5;
    	let form;
    	let div3;
    	let input0;
    	let t18;
    	let div4;
    	let span;
    	let t20;
    	let input1;
    	let div6_class_value;
    	let div7_class_value;
    	let t21;
    	let div9;
    	let div8;
    	let table2;
    	let tr4;
    	let td8;
    	let button5;
    	let svg1;
    	let path1;
    	let t22;
    	let tr5;
    	let td9;
    	let h20;
    	let div8_class_value;
    	let div9_class_value;
    	let t24;
    	let div11;
    	let div10;
    	let table3;
    	let tr6;
    	let td10;
    	let button6;
    	let svg2;
    	let path2;
    	let t25;
    	let tr7;
    	let td11;
    	let h21;
    	let div10_class_value;
    	let div11_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div0 = element("div");
    			button0 = element("button");
    			p0 = element("p");
    			p0.textContent = "log in";
    			t1 = space();
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "Floread";
    			t3 = space();
    			p2 = element("p");
    			p2.textContent = "Music stuck on the bookshelf";
    			t5 = space();
    			div2 = element("div");
    			p3 = element("p");
    			b = element("b");
    			b.textContent = "당신의 독서를 돕는 음악과 함께 하세요";
    			t7 = space();
    			table0 = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			img0 = element("img");
    			t8 = space();
    			td1 = element("td");
    			img1 = element("img");
    			t9 = space();
    			td2 = element("td");
    			img2 = element("img");
    			t10 = space();
    			tr1 = element("tr");
    			td3 = element("td");
    			button1 = element("button");
    			button1.textContent = "UPLOAD";
    			t12 = space();
    			td4 = element("td");
    			button2 = element("button");
    			button2.textContent = "VIEWER";
    			t14 = space();
    			td5 = element("td");
    			button3 = element("button");
    			button3.textContent = "MYPAGE";
    			t16 = space();
    			div7 = element("div");
    			div6 = element("div");
    			table1 = element("table");
    			tr2 = element("tr");
    			td6 = element("td");
    			button4 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t17 = space();
    			tr3 = element("tr");
    			td7 = element("td");
    			div5 = element("div");
    			form = element("form");
    			div3 = element("div");
    			input0 = element("input");
    			t18 = space();
    			div4 = element("div");
    			span = element("span");
    			span.textContent = "업로드";
    			t20 = space();
    			input1 = element("input");
    			t21 = space();
    			div9 = element("div");
    			div8 = element("div");
    			table2 = element("table");
    			tr4 = element("tr");
    			td8 = element("td");
    			button5 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t22 = space();
    			tr5 = element("tr");
    			td9 = element("td");
    			h20 = element("h2");
    			h20.textContent = "뷰어 페이지 화면 들어올 예정";
    			t24 = space();
    			div11 = element("div");
    			div10 = element("div");
    			table3 = element("table");
    			tr6 = element("tr");
    			td10 = element("td");
    			button6 = element("button");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t25 = space();
    			tr7 = element("tr");
    			td11 = element("td");
    			h21 = element("h2");
    			h21.textContent = "마이페이지 화면 들어올 예정";
    			set_style(p0, "line-height", "0px");
    			attr_dev(p0, "class", "svelte-1cq7tbb");
    			add_location(p0, file, 232, 137, 5226);
    			set_style(button0, "background", "none");
    			attr_dev(button0, "onclick", "window.open('http://floread.store:8000', '_blank', 'width=500,height=500')");
    			add_location(button0, file, 232, 2, 5091);
    			set_style(div0, "float", "right");
    			add_location(div0, file, 231, 1, 5063);
    			set_style(p1, "line-height", "0px");
    			set_style(p1, "font-size", "6.5em");
    			attr_dev(p1, "class", "svelte-1cq7tbb");
    			add_location(p1, file, 235, 4, 5294);
    			set_style(p2, "line-height", "0px");
    			attr_dev(p2, "class", "svelte-1cq7tbb");
    			add_location(p2, file, 236, 4, 5356);
    			add_location(div1, file, 234, 1, 5284);
    			add_location(b, file, 239, 86, 5551);
    			set_style(p3, "color", "rgba(255, 244,233)");
    			set_style(p3, "font-size", "3em");
    			set_style(p3, "font-family", "Gothic A1, san-serif");
    			attr_dev(p3, "class", "svelte-1cq7tbb");
    			add_location(p3, file, 239, 1, 5466);
    			set_style(img0, "margin", "auto");
    			if (!src_url_equal(img0.src, img0_src_value = /*src*/ ctx[7])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "이미지");
    			attr_dev(img0, "width", "150px");
    			attr_dev(img0, "height", "150px");
    			attr_dev(img0, "class", "svelte-1cq7tbb");
    			add_location(img0, file, 242, 6, 5657);
    			add_location(td0, file, 242, 2, 5653);
    			set_style(img1, "margin", "auto");
    			if (!src_url_equal(img1.src, img1_src_value = /*src2*/ ctx[8])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "이미지");
    			attr_dev(img1, "width", "150px");
    			attr_dev(img1, "height", "150px");
    			attr_dev(img1, "class", "svelte-1cq7tbb");
    			add_location(img1, file, 243, 6, 5745);
    			add_location(td1, file, 243, 2, 5741);
    			set_style(img2, "margin", "auto");
    			if (!src_url_equal(img2.src, img2_src_value = /*src3*/ ctx[9])) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "이미지");
    			attr_dev(img2, "width", "150px");
    			attr_dev(img2, "height", "150px");
    			attr_dev(img2, "class", "svelte-1cq7tbb");
    			add_location(img2, file, 244, 6, 5834);
    			add_location(td2, file, 244, 2, 5830);
    			add_location(tr0, file, 241, 1, 5646);
    			attr_dev(button1, "class", "btn svelte-1cq7tbb");
    			add_location(button1, file, 247, 6, 5938);
    			add_location(td3, file, 247, 2, 5934);
    			attr_dev(button2, "class", "btn svelte-1cq7tbb");
    			add_location(button2, file, 248, 6, 6008);
    			add_location(td4, file, 248, 2, 6004);
    			attr_dev(button3, "class", "btn svelte-1cq7tbb");
    			add_location(button3, file, 249, 6, 6079);
    			add_location(td5, file, 249, 2, 6075);
    			add_location(tr1, file, 246, 1, 5927);
    			set_style(table0, "width", "100%");
    			set_style(table0, "text-align", "center");
    			set_style(table0, "margin", "auto");
    			add_location(table0, file, 240, 0, 5584);
    			set_style(div2, "width", "95%");
    			set_style(div2, "margin", "auto");
    			add_location(div2, file, 238, 0, 5426);
    			attr_dev(path0, "fill", "currentColor");
    			attr_dev(path0, "d", "M12.7,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4l0,0c-0.4-0.4-1-0.4-1.4,0L11.3,10.6L6,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.3,5.3l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l5.3-5.3l5.3,5.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L12.7,12z");
    			add_location(path0, file, 260, 8, 6544);
    			attr_dev(svg0, "class", "close-icon svelte-1cq7tbb");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			add_location(svg0, file, 259, 6, 6491);
    			attr_dev(button4, "class", "close-button svelte-1cq7tbb");
    			attr_dev(button4, "aria-label", "Close modal");
    			add_location(button4, file, 258, 5, 6407);
    			add_location(td6, file, 257, 4, 6397);
    			add_location(tr2, file, 256, 3, 6388);
    			attr_dev(input0, "type", "file");
    			attr_dev(input0, "id", "file-input");
    			attr_dev(input0, "name", "file");
    			attr_dev(input0, "accept", "text/plain");
    			input0.multiple = true;
    			add_location(input0, file, 270, 7, 6972);
    			add_location(div3, file, 269, 6, 6959);
    			add_location(span, file, 273, 7, 7081);
    			attr_dev(input1, "type", "submit");
    			input1.value = "전송";
    			add_location(input1, file, 274, 7, 7105);
    			add_location(div4, file, 272, 6, 7068);
    			attr_dev(form, "enctype", "multipart/form-data");
    			add_location(form, file, 268, 5, 6916);
    			add_location(div5, file, 267, 4, 6905);
    			add_location(td7, file, 266, 3, 6896);
    			add_location(tr3, file, 265, 2, 6888);
    			set_style(table1, "width", "100%");
    			set_style(table1, "text-align", "center");
    			set_style(table1, "margin", "auto");
    			add_location(table1, file, 255, 2, 6324);
    			attr_dev(div6, "class", div6_class_value = "popup " + (/*popupVisible*/ ctx[0] ? 'visible' : '') + " svelte-1cq7tbb");
    			add_location(div6, file, 254, 1, 6232);
    			attr_dev(div7, "class", div7_class_value = "popup-wrapper " + (/*popupVisible*/ ctx[0] ? 'visible' : '') + " svelte-1cq7tbb");
    			add_location(div7, file, 253, 2, 6171);
    			attr_dev(path1, "fill", "currentColor");
    			attr_dev(path1, "d", "M12.7,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4l0,0c-0.4-0.4-1-0.4-1.4,0L11.3,10.6L6,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.3,5.3l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l5.3-5.3l5.3,5.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L12.7,12z");
    			add_location(path1, file, 289, 7, 7627);
    			attr_dev(svg1, "class", "close-icon svelte-1cq7tbb");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			add_location(svg1, file, 288, 5, 7575);
    			attr_dev(button5, "class", "close-button svelte-1cq7tbb");
    			attr_dev(button5, "aria-label", "Close modal");
    			add_location(button5, file, 287, 4, 7491);
    			add_location(td8, file, 286, 7, 7482);
    			add_location(tr4, file, 286, 3, 7478);
    			add_location(h20, file, 293, 11, 7973);
    			add_location(td9, file, 293, 7, 7969);
    			add_location(tr5, file, 293, 3, 7965);
    			set_style(table2, "width", "100%");
    			set_style(table2, "text-align", "center");
    			set_style(table2, "margin", "auto");
    			add_location(table2, file, 285, 2, 7414);
    			attr_dev(div8, "class", div8_class_value = "popup " + (/*popupVisible2*/ ctx[1] ? 'visible' : '') + " svelte-1cq7tbb");
    			add_location(div8, file, 284, 1, 7321);
    			attr_dev(div9, "class", div9_class_value = "popup-wrapper " + (/*popupVisible2*/ ctx[1] ? 'visible' : '') + " svelte-1cq7tbb");
    			add_location(div9, file, 283, 2, 7259);
    			attr_dev(path2, "fill", "currentColor");
    			attr_dev(path2, "d", "M12.7,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4l0,0c-0.4-0.4-1-0.4-1.4,0L11.3,10.6L6,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.3,5.3l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l5.3-5.3l5.3,5.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L12.7,12z");
    			add_location(path2, file, 303, 7, 8407);
    			attr_dev(svg2, "class", "close-icon svelte-1cq7tbb");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			add_location(svg2, file, 302, 5, 8355);
    			attr_dev(button6, "class", "close-button svelte-1cq7tbb");
    			attr_dev(button6, "aria-label", "Close modal");
    			add_location(button6, file, 301, 4, 8271);
    			add_location(td10, file, 300, 7, 8262);
    			add_location(tr6, file, 300, 3, 8258);
    			add_location(h21, file, 308, 4, 8758);
    			add_location(td11, file, 307, 7, 8749);
    			add_location(tr7, file, 307, 3, 8745);
    			set_style(table3, "width", "100%");
    			set_style(table3, "text-align", "center");
    			set_style(table3, "margin", "auto");
    			add_location(table3, file, 299, 2, 8194);
    			attr_dev(div10, "class", div10_class_value = "popup " + (/*popupVisible3*/ ctx[2] ? 'visible' : '') + " svelte-1cq7tbb");
    			add_location(div10, file, 298, 1, 8101);
    			attr_dev(div11, "class", div11_class_value = "popup-wrapper " + (/*popupVisible3*/ ctx[2] ? 'visible' : '') + " svelte-1cq7tbb");
    			add_location(div11, file, 297, 2, 8039);
    			attr_dev(body, "bgcolor", "black");
    			attr_dev(body, "class", "svelte-1cq7tbb");
    			add_location(body, file, 230, 0, 5039);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div0);
    			append_dev(div0, button0);
    			append_dev(button0, p0);
    			append_dev(body, t1);
    			append_dev(body, div1);
    			append_dev(div1, p1);
    			append_dev(div1, t3);
    			append_dev(div1, p2);
    			append_dev(body, t5);
    			append_dev(body, div2);
    			append_dev(div2, p3);
    			append_dev(p3, b);
    			append_dev(div2, t7);
    			append_dev(div2, table0);
    			append_dev(table0, tr0);
    			append_dev(tr0, td0);
    			append_dev(td0, img0);
    			append_dev(tr0, t8);
    			append_dev(tr0, td1);
    			append_dev(td1, img1);
    			append_dev(tr0, t9);
    			append_dev(tr0, td2);
    			append_dev(td2, img2);
    			append_dev(table0, t10);
    			append_dev(table0, tr1);
    			append_dev(tr1, td3);
    			append_dev(td3, button1);
    			append_dev(tr1, t12);
    			append_dev(tr1, td4);
    			append_dev(td4, button2);
    			append_dev(tr1, t14);
    			append_dev(tr1, td5);
    			append_dev(td5, button3);
    			append_dev(body, t16);
    			append_dev(body, div7);
    			append_dev(div7, div6);
    			append_dev(div6, table1);
    			append_dev(table1, tr2);
    			append_dev(tr2, td6);
    			append_dev(td6, button4);
    			append_dev(button4, svg0);
    			append_dev(svg0, path0);
    			append_dev(table1, t17);
    			append_dev(table1, tr3);
    			append_dev(tr3, td7);
    			append_dev(td7, div5);
    			append_dev(div5, form);
    			append_dev(form, div3);
    			append_dev(div3, input0);
    			append_dev(form, t18);
    			append_dev(form, div4);
    			append_dev(div4, span);
    			append_dev(div4, t20);
    			append_dev(div4, input1);
    			append_dev(body, t21);
    			append_dev(body, div9);
    			append_dev(div9, div8);
    			append_dev(div8, table2);
    			append_dev(table2, tr4);
    			append_dev(tr4, td8);
    			append_dev(td8, button5);
    			append_dev(button5, svg1);
    			append_dev(svg1, path1);
    			append_dev(table2, t22);
    			append_dev(table2, tr5);
    			append_dev(tr5, td9);
    			append_dev(td9, h20);
    			append_dev(body, t24);
    			append_dev(body, div11);
    			append_dev(div11, div10);
    			append_dev(div10, table3);
    			append_dev(table3, tr6);
    			append_dev(tr6, td10);
    			append_dev(td10, button6);
    			append_dev(button6, svg2);
    			append_dev(svg2, path2);
    			append_dev(table3, t25);
    			append_dev(table3, tr7);
    			append_dev(tr7, td11);
    			append_dev(td11, h21);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*toggle*/ ctx[3], false, false, false, false),
    					listen_dev(button1, "click", /*togglePopup*/ ctx[4], false, false, false, false),
    					listen_dev(button2, "click", /*togglePopup2*/ ctx[5], false, false, false, false),
    					listen_dev(button3, "click", /*togglePopup3*/ ctx[6], false, false, false, false),
    					listen_dev(button4, "click", /*togglePopup*/ ctx[4], false, false, false, false),
    					listen_dev(input1, "click", prevent_default(/*uploadFile*/ ctx[10]), false, true, false, false),
    					listen_dev(div6, "click", click_handler, false, false, false, false),
    					listen_dev(button5, "click", /*togglePopup2*/ ctx[5], false, false, false, false),
    					listen_dev(div8, "click", click_handler_1, false, false, false, false),
    					listen_dev(button6, "click", /*togglePopup3*/ ctx[6], false, false, false, false),
    					listen_dev(div10, "click", click_handler_2, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*popupVisible*/ 1 && div6_class_value !== (div6_class_value = "popup " + (/*popupVisible*/ ctx[0] ? 'visible' : '') + " svelte-1cq7tbb")) {
    				attr_dev(div6, "class", div6_class_value);
    			}

    			if (dirty & /*popupVisible*/ 1 && div7_class_value !== (div7_class_value = "popup-wrapper " + (/*popupVisible*/ ctx[0] ? 'visible' : '') + " svelte-1cq7tbb")) {
    				attr_dev(div7, "class", div7_class_value);
    			}

    			if (dirty & /*popupVisible2*/ 2 && div8_class_value !== (div8_class_value = "popup " + (/*popupVisible2*/ ctx[1] ? 'visible' : '') + " svelte-1cq7tbb")) {
    				attr_dev(div8, "class", div8_class_value);
    			}

    			if (dirty & /*popupVisible2*/ 2 && div9_class_value !== (div9_class_value = "popup-wrapper " + (/*popupVisible2*/ ctx[1] ? 'visible' : '') + " svelte-1cq7tbb")) {
    				attr_dev(div9, "class", div9_class_value);
    			}

    			if (dirty & /*popupVisible3*/ 4 && div10_class_value !== (div10_class_value = "popup " + (/*popupVisible3*/ ctx[2] ? 'visible' : '') + " svelte-1cq7tbb")) {
    				attr_dev(div10, "class", div10_class_value);
    			}

    			if (dirty & /*popupVisible3*/ 4 && div11_class_value !== (div11_class_value = "popup-wrapper " + (/*popupVisible3*/ ctx[2] ? 'visible' : '') + " svelte-1cq7tbb")) {
    				attr_dev(div11, "class", div11_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function mypage() {
    	fetch('http://floread.store:8000/mypage').then(response => response.json()).then(data => {
    		console.log(data); //읽어온 데이터를 json으로 변환
    	}).catch(error => {
    		console.error(error);
    	});
    }

    const click_handler = e => e.stopPropagation();
    const click_handler_1 = e => e.stopPropagation();
    const click_handler_2 = e => e.stopPropagation();

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Floread', slots, []);
    	let popupVisible = false;
    	let popupVisible2 = false;
    	let popupVisible3 = false;
    	let user = { loggedIn: false };

    	function toggle() {
    		user.loggedIn = !user.loggedIn;
    	}

    	function togglePopup() {
    		$$invalidate(0, popupVisible = !popupVisible);
    	}

    	function togglePopup2() {
    		$$invalidate(1, popupVisible2 = !popupVisible2);
    	}

    	function togglePopup3() {
    		$$invalidate(2, popupVisible3 = !popupVisible3);

    		if (popupVisible3) {
    			mypage();
    		}
    	}

    	function handleClick(event) {
    		if (popupVisible && !event.target.classList.contains('close-button')) {
    			event.stopPropagation();
    			return false;
    		} else if (popupVisible2 && !event.target.classList.contains('close-button')) {
    			event.stopPropagation();
    			return false;
    		} else if (popupVisible3 && !event.target.classList.contains('close-button')) {
    			event.stopPropagation();
    			return false;
    		}
    	}

    	let src = "https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/1166091_ORSJPI0.jpg";
    	let src2 = "https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/5542689_2866296.jpg";
    	let src3 = "https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/5567275_2901224.jpg";

    	onMount(() => {
    		document.addEventListener('click', handleClick);

    		return () => {
    			document.removeEventListener('click', handleClick);
    		};
    	});

    	function uploadFile() {
    		//event.preventDefault(); // Prevent the default form submission
    		const fileInput = document.getElementById('file-input');

    		const files = fileInput.files;
    		if (files.length === 0) return;
    		const formData = new FormData();

    		Array.from(files).forEach(file => {
    			formData.append('files', file);
    		});

    		fetch('http://floread.store:8000/upload', { method: 'POST', body: formData }).then(response => {
    			if (response.ok === false) {
    				throw new Error(response.status);
    			}

    			response.text();
    			console.log(response);
    		}).then(data => {
    			alert('정상적으로 업로드되었습니다.');
    			$$invalidate(0, popupVisible = !popupVisible);
    		}).catch(error => {
    			//에러가 406이면 팝업으로 이미존재하는 파일입니다. 출력
    			if (error.message == 500) {
    				alert('파일을 업로드할 수 없습니다.'); // Handle the response data
    				return;
    			}

    			alert('이미 존재하는 파일입니다.');
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Floread> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		mypage,
    		onMount,
    		popupVisible,
    		popupVisible2,
    		popupVisible3,
    		user,
    		toggle,
    		togglePopup,
    		togglePopup2,
    		togglePopup3,
    		handleClick,
    		src,
    		src2,
    		src3,
    		uploadFile
    	});

    	$$self.$inject_state = $$props => {
    		if ('popupVisible' in $$props) $$invalidate(0, popupVisible = $$props.popupVisible);
    		if ('popupVisible2' in $$props) $$invalidate(1, popupVisible2 = $$props.popupVisible2);
    		if ('popupVisible3' in $$props) $$invalidate(2, popupVisible3 = $$props.popupVisible3);
    		if ('user' in $$props) user = $$props.user;
    		if ('src' in $$props) $$invalidate(7, src = $$props.src);
    		if ('src2' in $$props) $$invalidate(8, src2 = $$props.src2);
    		if ('src3' in $$props) $$invalidate(9, src3 = $$props.src3);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		popupVisible,
    		popupVisible2,
    		popupVisible3,
    		toggle,
    		togglePopup,
    		togglePopup2,
    		togglePopup3,
    		src,
    		src2,
    		src3,
    		uploadFile
    	];
    }

    class Floread extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Floread",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new Floread({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
