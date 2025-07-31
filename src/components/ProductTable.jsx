import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  TextField,
  Grid,
  Paper,
  IconButton,
  Button,
  Box,
  Divider,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Alert,
  Tooltip,
  Chip,
  Avatar,
  LinearProgress,
  ThemeProvider,
  createTheme,
  CssBaseline
} from "@mui/material";
import { 
  Delete as DeleteIcon, 
  AddCircle as AddCircleIcon, 
  Save, 
  Calculate,
  Factory,
  Bed,
  Inventory,
  Widgets,
  Straighten,
  ContentCut,
  DoneAll,
  NoteAdd,
  Settings,
  Brightness4,
  Brightness7
} from "@mui/icons-material";
import Swal from "sweetalert2";

const initialSubcomponent = {
  name: "",
  material: "",
  count: 1,
  detailSize: { length: "", width: "", thickness: "" },
  cuttingSize: { length: "", width: "", thickness: "" },
  finalSize: { length: "", width: "", thickness: "" },
  veneerInner: false,
  veneerOuter: false,
  notes: "",
};

export default function ProductManagerUI() {
  // حالة الوضع الليلي
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode ? savedMode : "light";
  });
  
  const [product, setProduct] = useState({ name: "", price: "" });
  const [component, setComponent] = useState({ name: "", quantity: 1 });
  const [subcomponents, setSubcomponents] = useState([{ ...initialSubcomponent }]);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // إنشاء السمة الديناميكية
  const theme = useMemo(() => createTheme({
    direction: "rtl",
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#90caf9" : "#1976d2",
      },
      secondary: {
        main: mode === "dark" ? "#ce93d8" : "#9c27b0",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#f5f5f5",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily: "'Cairo', sans-serif",
      h4: {
        fontWeight: 700,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: "all 0.3s ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            transition: "all 0.3s ease",
          },
        },
      },
    },
  }), [mode]);

  // تبديل الوضع الليلي/النهاري
  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  // حساب المقاسات النهائية تلقائياً عند تغيير التفصيل أو التقصيب
  useEffect(() => {
    if (autoCalculate) {
      const updated = subcomponents.map(sub => {
        const finalSize = {
          length: calculateFinalSize(sub.detailSize.length, sub.cuttingSize.length),
          width: calculateFinalSize(sub.detailSize.width, sub.cuttingSize.width),
          thickness: calculateFinalSize(sub.detailSize.thickness, sub.cuttingSize.thickness)
        };
        return { ...sub, finalSize };
      });
      setSubcomponents(updated);
    }
  }, [subcomponents.map(sub => `${sub.detailSize.length}-${sub.cuttingSize.length}`).join()]);

  const calculateFinalSize = (detail, cutting) => {
    if (!detail || !cutting) return "";
    const detailNum = parseFloat(detail);
    const cuttingNum = parseFloat(cutting);
    if (isNaN(cuttingNum)) return detail;
    return (detailNum - (detailNum - cuttingNum) * 0.5).toFixed(2);
  };

  const handleSubChange = (index, key, value, subKey) => {
    const updated = [...subcomponents];
    if (subKey) {
      updated[index][key][subKey] = value;
    } else {
      updated[index][key] = value;
    }
    setSubcomponents(updated);
  };

  const addSubcomponent = () => {
    setSubcomponents([...subcomponents, { ...initialSubcomponent }]);
  };

  const removeSubcomponent = (index) => {
    if (subcomponents.length > 1) {
      const updated = [...subcomponents];
      updated.splice(index, 1);
      setSubcomponents(updated);
    } else {
      Swal.fire({
        icon: "warning",
        title: "لا يمكن حذف كل المكونات",
        text: "يجب أن يحتوي المنتج على مكون فرعي واحد على الأقل",
        confirmButtonText: "حسناً"
      });
    }
  };

  const calculateFinalSizes = () => {
    const updated = subcomponents.map(sub => {
      const finalSize = {
        length: calculateFinalSize(sub.detailSize.length, sub.cuttingSize.length),
        width: calculateFinalSize(sub.detailSize.width, sub.cuttingSize.width),
        thickness: calculateFinalSize(sub.detailSize.thickness, sub.cuttingSize.thickness)
      };
      return { ...sub, finalSize };
    });
    setSubcomponents(updated);
  };

  const handleSubmit = async () => {
    // التحقق من البيانات قبل الإرسال
    const requiredFields = [
      !product.name && "اسم المنتج",
      !component.name && "اسم المكون",
      ...subcomponents.map((sub, i) => !sub.name && `اسم القطعة في المكون الفرعي ${i + 1}`)
    ].filter(Boolean);

    if (requiredFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "بيانات ناقصة",
        html: `الحقول التالية مطلوبة:<br><ul><li>${requiredFields.join("</li><li>")}</li></ul>`,
        confirmButtonText: "حسناً"
      });
      return;
    }

    setIsSaving(true);
    const updatedSubcomponents = subcomponents.map(sub => ({
      ...sub,
      totalQuantity: sub.count * component.quantity
    }));

    const fullData = {
      product,
      component,
      subcomponents: updatedSubcomponents,
      createdAt: new Date().toISOString()
    };

    try {
      // محاكاة عملية الحفظ
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Swal.fire({
        icon: "success",
        title: "تم الحفظ بنجاح",
        text: "تم إرسال البيانات إلى قاعدة البيانات.",
        confirmButtonText: "حسناً"
      });
      
      setProduct({ name: "", price: "" });
      setComponent({ name: "", quantity: 1 });
      setSubcomponents([{ ...initialSubcomponent }]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ في الاتصال",
        text: "تعذر الاتصال بالخادم.",
        confirmButtonText: "إغلاق"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ mt: 2, mb: 6 }}>
        {/* شريط العنوان والإعدادات */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          p: 2,
          backgroundColor: 'primary.dark',
          color: 'primary.contrastText',
          borderRadius: 1,
          boxShadow: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Factory sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              نظام إدارة المصنع
            </Typography>
          </Box>
          <Box>
            <Tooltip title={mode === "dark" ? "الوضع النهاري" : "الوضع الليلي"}>
              <IconButton color="inherit" onClick={toggleMode}>
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            <Tooltip title="الإعدادات">
              <IconButton color="inherit">
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {isSaving && (
          <LinearProgress color="secondary" sx={{ mb: 2, height: 6 }} />
        )}

        {/* إعدادات الحساب التلقائي */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={autoCalculate}
                    onChange={(e) => setAutoCalculate(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    الحساب التلقائي للمقاسات النهائية
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'end' }}>
              {!autoCalculate && (
                <Button
                  variant="contained"
                  startIcon={<Calculate />}
                  onClick={calculateFinalSizes}
                  sx={{ ml: 2 }}
                >
                  حساب المقاسات النهائية
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {/* قسم المنتج */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', borderTop: `4px solid ${theme.palette.primary.main}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Bed color="primary" sx={{ fontSize: 30, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  تفاصيل المنتج
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="اسم المنتج" 
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    required
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    type="number" 
                    label="السعر"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">جنيه</InputAdornment>,
                    }}
                    size="small"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* قسم المكون */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', borderTop: `4px solid ${theme.palette.secondary.main}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Inventory color="secondary" sx={{ fontSize: 30, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  بيانات المكون
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="اسم المكون"
                    value={component.name}
                    onChange={(e) => setComponent({ ...component, name: e.target.value })}
                    required
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    type="number" 
                    label="الكمية"
                    value={component.quantity}
                    onChange={(e) => setComponent({ ...component, quantity: +e.target.value })}
                    size="small"
                    inputProps={{ min: 1 }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* قسم المكونات الفرعية */}
        <Paper elevation={3} sx={{ p: 3, mt: 3, borderTop: `4px solid ${theme.palette.info.main}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Widgets color="info" sx={{ fontSize: 30, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
              المكونات الفرعية
            </Typography>
            <Button 
              startIcon={<AddCircleIcon />} 
              onClick={addSubcomponent} 
              variant="contained"
              color="info"
            >
              إضافة مكون فرعي
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {subcomponents.map((sub, i) => (
            <Paper 
              key={i} 
              elevation={2} 
              sx={{ 
                p: 3, 
                mt: 3, 
                position: 'relative',
                borderLeft: `4px solid ${theme.palette.success.light}`,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              <Box sx={{ 
                position: 'absolute', 
                top: 8, 
                left: 8,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Chip
                  avatar={<Avatar>{i+1}</Avatar>}
                  label={`المكون الفرعي #${i+1}`}
                  color="primary"
                  size="small"
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title="حذف المكون">
                  <IconButton 
                    color="error" 
                    onClick={() => removeSubcomponent(i)}
                    sx={{ 
                      bgcolor: 'error.light', 
                      '&:hover': { bgcolor: 'error.main' },
                      mb: 1
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="اسم القطعة"
                    value={sub.name}
                    onChange={(e) => handleSubChange(i, "name", e.target.value)}
                    required
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="الخامة"
                    value={sub.material}
                    onChange={(e) => handleSubChange(i, "material", e.target.value)}
                    required
                    size="small"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField 
                    fullWidth 
                    type="number" 
                    label="العدد"
                    value={sub.count}
                    onChange={(e) => handleSubChange(i, "count", +e.target.value)}
                    size="small"
                    inputProps={{ min: 1 }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sub.veneerInner}
                        onChange={(e) => handleSubChange(i, "veneerInner", e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        قشرة داخلية
                      </Typography>
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sub.veneerOuter}
                        onChange={(e) => handleSubChange(i, "veneerOuter", e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        قشرة خارجية
                      </Typography>
                    }
                  />
                </Grid>

                {/* مقاسات التفصيل */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Straighten color="action" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      مقاسات التفصيل
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="الطول (سم)"
                    value={sub.detailSize.length}
                    onChange={(e) => handleSubChange(i, "detailSize", e.target.value, "length")}
                    type="number"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="العرض (سم)"
                    value={sub.detailSize.width}
                    onChange={(e) => handleSubChange(i, "detailSize", e.target.value, "width")}
                    type="number"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="السُمك (سم)"
                    value={sub.detailSize.thickness}
                    onChange={(e) => handleSubChange(i, "detailSize", e.target.value, "thickness")}
                    type="number"
                    size="small"
                    variant="outlined"
                  />
                </Grid>

                {/* مقاسات التقصيب */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}>
                    <ContentCut color="action" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      مقاسات التقصيب
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="الطول (سم)"
                    value={sub.cuttingSize.length}
                    onChange={(e) => handleSubChange(i, "cuttingSize", e.target.value, "length")}
                    type="number"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="العرض (سم)"
                    value={sub.cuttingSize.width}
                    onChange={(e) => handleSubChange(i, "cuttingSize", e.target.value, "width")}
                    type="number"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="السُمك (سم)"
                    value={sub.cuttingSize.thickness}
                    onChange={(e) => handleSubChange(i, "cuttingSize", e.target.value, "thickness")}
                    type="number"
                    size="small"
                    variant="outlined"
                  />
                </Grid>

                {/* المقاسات النهائية */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}>
                    <DoneAll color="action" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      المقاسات النهائية
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="الطول (سم)"
                    value={sub.finalSize.length}
                    onChange={(e) => handleSubChange(i, "finalSize", e.target.value, "length")}
                    type="number"
                    size="small"
                    InputProps={{
                      readOnly: autoCalculate,
                    }}
                    variant="outlined"
                    sx={autoCalculate ? { 
                      backgroundColor: theme.palette.action.selected,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.divider
                      }
                    } : {}}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="العرض (سم)"
                    value={sub.finalSize.width}
                    onChange={(e) => handleSubChange(i, "finalSize", e.target.value, "width")}
                    type="number"
                    size="small"
                    InputProps={{
                      readOnly: autoCalculate,
                    }}
                    variant="outlined"
                    sx={autoCalculate ? { 
                      backgroundColor: theme.palette.action.selected,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.divider
                      }
                    } : {}}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="السُمك (سم)"
                    value={sub.finalSize.thickness}
                    onChange={(e) => handleSubChange(i, "finalSize", e.target.value, "thickness")}
                    type="number"
                    size="small"
                    InputProps={{
                      readOnly: autoCalculate,
                    }}
                    variant="outlined"
                    sx={autoCalculate ? { 
                      backgroundColor: theme.palette.action.selected,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.divider
                      }
                    } : {}}
                  />
                </Grid>

                {/* ملاحظات */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}>
                    <NoteAdd color="action" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      ملاحظات
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <TextField 
                    fullWidth 
                    multiline 
                    minRows={3} 
                    label="أدخل ملاحظاتك هنا"
                    value={sub.notes}
                    onChange={(e) => handleSubChange(i, "notes", e.target.value)}
                    size="small"
                    variant="outlined"
                  />
                </Grid>

                {/* إجمالي الكمية */}
                <Grid item xs={12}>
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 2,
                      '& .MuiAlert-icon': {
                        alignItems: 'center'
                      }
                    }}
                    icon={
                      <Chip 
                        label={sub.count * component.quantity} 
                        color="info" 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    }
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      <strong>عدد الإنتاج:</strong> {sub.count * component.quantity} قطعة
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </Paper>
          ))}

          {/* زر الحفظ */}
          <Box sx={{ 
            textAlign: 'center', 
            mt: 4,
            position: 'sticky',
            bottom: 20,
            zIndex: 1000
          }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<Save />}
              onClick={handleSubmit}
              disabled={isSaving}
              sx={{
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isSaving ? 'جاري الحفظ...' : 'حفظ البيانات'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}