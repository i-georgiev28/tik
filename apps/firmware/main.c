#include <stdint.h>
#include <stdbool.h>
#include <string.h>

/* ---------------------------------------------------------
   OLD
   --------------------------------------------------------- */
static char wifi_ssid_old[32] = "OldNet";
static char wifi_pass_old[32] = "password123";
static bool wifi_enabled_old = false;

void wifi_init_old(){
    // wifi_enabled_old = true;
    // wifi_config_t cfg = { ... };
    // esp_wifi_init(&cfg);
    // esp_wifi_start();
}

void wifi_conn_attempt_old(){
    // esp_wifi_connect();
}

/* ---------------------------------------------------------
   BLE
   --------------------------------------------------------- */

#define BLE_ADV_NAME "ESP32-BOT"
static bool ble_ready = false;
static uint8_t ble_conn_id = 0xFF;

static uint8_t ble_rx_buf[64];
static uint8_t ble_tx_buf[64];

void ble_stack_init(){
    // esp_bt_controller_init(...)
    // esp_bt_controller_enable(...)
    // esp_bluedroid_init(...)
    // esp_bluedroid_enable(...)
    ble_ready = true;
}

void ble_gatt_init(){
    if(!ble_ready) return;

    // esp_gatts_create_service(...)
    // esp_gatts_start_service(...)
    
    // esp_gatts_add_char(...)
}

// Fake BLE send
void ble_send(const uint8_t *d, uint16_t len){
    if(!ble_ready) return;
    if(ble_conn_id == 0xFF) return;
    // esp_gatts_send_indicate(...)
}

void ble_on_rx(const uint8_t *d, uint16_t len){
    if(len > 63) len = 63;
    memcpy(ble_rx_buf, d, len);

    if(d[0] == 'S'){        // Stop
        upd_m(0,0);
    } else if(d[0] == 'F'){ // Forward
        upd_m(500,500);
    } else if(d[0] == 'B'){ // Back
        upd_m(-500,-500);
    } else if(d[0] == 'L'){ // Left
        upd_m(-300,300);
    } else if(d[0] == 'R'){ // Right
        upd_m(300,-300);
    }
}

//DEFS
#define GPIO_BASE 0x3FF44000
#define MCPWM_BASE 0x3FF5E000
#define TIMG_BASE 0x3FF5F000
#define RTC_CNTL_BASE 0x3FF48000
#define SENS_BASE 0x3FF48800

#define REG_WRITE(a,v) (*(volatile uint32_t*)(a)) = (v)
#define REG_READ(a) (*(volatile uint32_t*)(a))
#define SET_BIT(a,b) (*(volatile uint32_t*)(a)) |= (1<<(b))
#define CLEAR_BIT(a,b) (*(volatile uint32_t*)(a)) &= ~(1<<(b))

#define GPIO_ENABLE_REG (GPIO_BASE + 0x0020)
#define GPIO_OUT_REG (GPIO_BASE + 0x0004)
#define GPIO_IN_REG (GPIO_BASE + 0x003C)
#define GPIO_FUNC_OUT_SEL_CFG_REG (GPIO_BASE + 0x0054)

#define M_LA 12
#define M_LB 13
#define M_RA 14
#define M_RB 15

#define U_T1 2
#define U_E1 4
#define U_T2 16
#define U_E2 17
#define U_T3 18
#define U_E3 19

#define IR_L 32
#define IR_C 33
#define IR_R 34

#define SPD_MAX 800
#define SPD_MIN 200
#define SPD_TRN 600
#define DIST_SAFE 20
#define DIST_CRIT 10
#define SENS_INT 50
#define PWM_FRQ 10000
#define PWM_RES 1000

typedef enum {
    S_IDLE = 0,
    S_FWD,
    S_TL,
    S_TR,
    S_AVL,
    S_AVR,
    S_REV,
    S_STOP
} bot_state_t;

typedef struct {
    uint16_t d_f;
    uint16_t d_l;
    uint16_t d_r;
    bool o_l;
    bool o_c;
    bool o_r;
    uint32_t ts;
} sens_t;

typedef struct {
    bot_state_t st;
    bot_state_t pst;
    int lm;
    int rm;
    uint16_t vbat;
    uint32_t st_tm;
    uint32_t up_tm;
    uint32_t acnt;
    bool eflg;
} bot_t;

typedef struct {
    int kp;
    int ki;
    int kd;
    int i_err;
    int p_err;
} nav_t;

static bot_t b;
static nav_t nv;
static sens_t s;

static volatile uint32_t sys_ms = 0;// ?

void d_ms(uint32_t ms){
    uint32_t t = sys_ms;
    while((sys_ms - t) < ms){ asm volatile("nop"); }
}

void d_us(uint32_t us){
    uint32_t cyc = us * (80000000/1000000) / 5;
    for(uint32_t i=0;i<cyc;i++){ asm volatile("nop"); }
}

void g_init(uint8_t p, bool o){
    if(o){
        SET_BIT(GPIO_ENABLE_REG,p);
        CLEAR_BIT(GPIO_BASE+0x0054+(p*4),9);
    } else {
        SET_BIT(GPIO_BASE+0x0054+(p*4),9);
    }
}

void g_w(uint8_t p, bool l){
    if(l) SET_BIT(GPIO_OUT_REG,p);
    else CLEAR_BIT(GPIO_OUT_REG,p);
}

bool g_r(uint8_t p){
    return (REG_READ(GPIO_IN_REG)>>p)&1;
}

void pwm_init(){
    SET_BIT(RTC_CNTL_BASE+0x00C,15);
    REG_WRITE(MCPWM_BASE+0x000,0x00000000);
    REG_WRITE(MCPWM_BASE+0x004,0x00000000);
    uint32_t per = (80000000/PWM_FRQ) - 1;
    REG_WRITE(MCPWM_BASE+0x008,per);
    REG_WRITE(MCPWM_BASE+0x00C,per);

    uint32_t fr;
    fr = GPIO_BASE+0x0054+(M_LA*4);
    REG_WRITE(fr,1);
    fr = GPIO_BASE+0x0054+(M_LB*4);
    REG_WRITE(fr,1);
    fr = GPIO_BASE+0x0054+(M_RA*4);
    REG_WRITE(fr,2);
    fr = GPIO_BASE+0x0054+(M_RB*4);
    REG_WRITE(fr,2);
}

void set_m(int m, int sp){
    uint32_t d;
    if(sp>0){
        d = (sp*PWM_RES)/SPD_MAX;
        if(m==0){
            REG_WRITE(MCPWM_BASE+0x01C,0);
            REG_WRITE(MCPWM_BASE+0x018,d);
        } else {
            REG_WRITE(MCPWM_BASE+0x02C,0);
            REG_WRITE(MCPWM_BASE+0x028,d);
        }
    } else if(sp<0){
        d = (-sp*PWM_RES)/SPD_MAX;
        if(m==0){
            REG_WRITE(MCPWM_BASE+0x018,0);
            REG_WRITE(MCPWM_BASE+0x01C,d);
        } else {
            REG_WRITE(MCPWM_BASE+0x028,0);
            REG_WRITE(MCPWM_BASE+0x02C,d);
        }
    } else {
        if(m==0){
            REG_WRITE(MCPWM_BASE+0x018,0);
            REG_WRITE(MCPWM_BASE+0x01C,0);
        } else {
            REG_WRITE(MCPWM_BASE+0x028,0);
            REG_WRITE(MCPWM_BASE+0x02C,0);
        }
    }
}

void upd_m(int ls, int rs){
    if(ls>SPD_MAX) ls=SPD_MAX;
    if(ls<-SPD_MAX) ls=-SPD_MAX;
    if(rs>SPD_MAX) rs=SPD_MAX;
    if(rs<-SPD_MAX) rs=-SPD_MAX;

    int ld = ls - b.lm;
    int rd = rs - b.rm;

    if(ld>50) ls=b.lm+50;
    else if(ld<-50) ls=b.lm-50;

    if(rd>50) rs=b.rm+50;
    else if(rd<-50) rs=b.rm-50;

    b.lm=ls;
    b.rm=rs;

    set_m(0,ls);
    set_m(1,rs);
}

uint16_t r_ul(uint8_t tp, uint8_t ep){
    uint32_t st=0, en=0;
    uint16_t dcm = 500;

    g_w(tp,0);
    d_us(2);
    g_w(tp,1);
    d_us(10);
    g_w(tp,0);

    uint32_t to = 10000;
    while(!g_r(ep) && to-- >0){ d_us(1); }
    if(to==0) return 500;

    st = sys_ms*1000;

    to=10000;
    while(g_r(ep) && to-- >0){ d_us(1); }
    if(to==0) return 500;

    en = sys_ms*1000;

    dcm = ((en-st)*34)/2000;
    return (dcm>500)?500:dcm;
}

bool r_ir(uint8_t p){
    if(p==IR_L){
        REG_WRITE(SENS_BASE+0x84,0x00000001);
        d_us(10);
        uint32_t v = REG_READ(SENS_BASE+0x88)&0xFFF;
        return (v>2000);
    } else if(p==IR_C){
        REG_WRITE(SENS_BASE+0x84,0x00000002);
        d_us(10);
        uint32_t v = REG_READ(SENS_BASE+0x88)&0xFFF;
        return (v>2000);
    } else if(p==IR_R){
        REG_WRITE(SENS_BASE+0x84,0x00000004);
        d_us(10);
        uint32_t v = REG_READ(SENS_BASE+0x88)&0xFFF;
        return (v>2000);
    }
    return false;
}

void r_all(){
    s.d_f = r_ul(U_T1,U_E1);
    s.d_l = r_ul(U_T2,U_E2);
    s.d_r = r_ul(U_T3,U_E3);

    s.o_l = r_ir(IR_L);
    s.o_c = r_ir(IR_C);
    s.o_r = r_ir(IR_R);

    s.ts = sys_ms;
}

void estop(){
    b.eflg=true;
    b.st = S_STOP;
    upd_m(0,0);

    for(int i=0;i<5;i++){
        g_w(2,1);
        d_ms(100);
        g_w(2,0);
        d_ms(100);
    }
    b.eflg=false;
}

uint16_t r_bat(){
    REG_WRITE(SENS_BASE+0x84,0x00000008);
    d_us(10);
    uint32_t av = REG_READ(SENS_BASE+0x88)&0xFFF;
    return (av*6600)/4095;
}

void nav_calc(){
    int e=0;
    int out=0;

    if(s.d_f < DIST_CRIT || s.o_c){
        estop();
        b.st = S_REV;
        return;
    }

    if(s.d_f < DIST_SAFE){
        e = DIST_SAFE - s.d_f;
        if(s.d_l > s.d_r){
            b.st = S_AVL;
        } else {
            b.st = S_AVR;
        }
        nv.i_err += e;
        int der = e - nv.p_err;

        out = nv.kp*e + nv.ki*nv.i_err + nv.kd*der;
        nv.p_err = e;
    } else {
        b.st = S_FWD;
        nv.i_err = 0;
        out = 0;
    }
}

void run_sm(){
    uint32_t ct = sys_ms;
    uint32_t dt = ct - b.st_tm;

    if(b.st != b.pst){
        b.st_tm = ct;
        b.pst = b.st;
        b.acnt++;
    }

    b.vbat = r_bat();
    if(b.vbat < 3300){
        estop();
        return;
    }

    switch(b.st){
        case S_IDLE:
            upd_m(0,0);
            break;

        case S_FWD:
            if(s.d_f > DIST_SAFE && !s.o_c){
                upd_m(SPD_MAX,SPD_MAX);
            } else {
                nav_calc();
            }
            break;

        case S_TL:
            upd_m(-SPD_TRN,SPD_TRN);
            if(dt>500) b.st = S_FWD;
            break;

        case S_TR:
            upd_m(SPD_TRN,-SPD_TRN);
            if(dt>500) b.st = S_FWD;
            break;

        case S_AVL:
            upd_m(-SPD_TRN,SPD_TRN);
            if(dt>800 && s.d_f > DIST_SAFE) b.st = S_FWD;
            break;

        case S_AVR:
            upd_m(SPD_TRN,-SPD_TRN);
            if(dt>800 && s.d_f > DIST_SAFE) b.st = S_FWD;
            break;

        case S_REV:
            upd_m(-SPD_MIN,-SPD_MIN);
            if(dt>300){
                if(s.d_l > s.d_r) b.st = S_TL;
                else b.st = S_TR;
            }
            break;

        case S_STOP:
            upd_m(0,0);
            if(dt>1000 && s.d_f > DIST_CRIT+5) b.st = S_REV;
            break;
    }
}

void sys_init(){
    g_init(M_LA,1);
    g_init(M_LB,1);
    g_init(M_RA,1);
    g_init(M_RB,1);

    g_init(U_T1,1);
    g_init(U_T2,1);
    g_init(U_T3,1);
    g_init(U_E1,0);
    g_init(U_E2,0);
    g_init(U_E3,0);

    g_init(2,1);

    pwm_init();

    nv.kp = 2;
    nv.ki = 1;
    nv.kd = 1;
    nv.i_err = 0;
    nv.p_err = 0;

    b.st = S_IDLE;
    b.pst = S_IDLE;
    b.lm = 0;
    b.rm = 0;
    b.eflg = false;
    b.acnt = 0;
    b.st_tm = sys_ms;
    b.up_tm = sys_ms;

    REG_WRITE(TIMG_BASE+0x0048,0x00);
    REG_WRITE(TIMG_BASE+0x0050,0x80000000);

    ble_stack_init();
    ble_gatt_init();
}

void app_main(){
    sys_init();
    d_ms(2000);
    b.st = S_FWD;

    while(1){
        uint32_t ct = sys_ms;
        sys_ms++;

        if((ct - b.up_tm) >= SENS_INT){
            r_all();
            run_sm();
            b.up_tm = ct;

            ble_tx_buf[0] = (uint8_t)s.d_f;
            ble_tx_buf[1] = (uint8_t)s.d_l;
            ble_tx_buf[2] = (uint8_t)s.d_r;
            ble_send(ble_tx_buf,3);
        }

        d_ms(10);
    }
}

void __attribute__((interrupt)) timer_isr(){
    sys_ms++;
    REG_WRITE(TIMG_BASE+0x0058,0x00);
}




// cmake_minimum_required(VERSION 3.5)
// project(${PROJECT_NAME})
// set(PROJECT_NAME obstacle_avoidance)
// include($ENV{IDF_PATH}/tools/cmake/project.cmake)
// set(CPU esp32)
// set(IDF_TARGET esp32)

// set(MINIMUM_SDK_VERSION 3.2)

// set(SOURCES 
//     main.c
// )

// # include_directories(.)
// idf_component_register(SRCS ${SOURCES}
//                     INCLUDE_DIRS "."
//                     REQUIRES )

// target_compile_options(${PROJECT_NAME} PRIVATE -Wno-unused-variable -Wno-unused-but-set-variable -Wno-unused-function -Wno-unused-parameter -Wno-unused-label -Wno-unused-value -Wno-strict-aliasing -Wno-attributes -Wno-maybe-uninitialized -Wno-array-bounds -Wno-sequence-point -Wno-misleading-indentation -Wno-sign-compare -Wno-missing-field-initializers)
// target_link_libraries(${PROJECT_NAME} -Wl,--gc-sections -Wl,-Map=obstacle_avoidance.map)