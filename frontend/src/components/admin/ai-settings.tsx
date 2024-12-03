import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function AISettings() {
  const [riskThresholds, setRiskThresholds] = useState({
    high: 70,
    medium: 30
  });

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Thresholds</CardTitle>
          <CardDescription>
            Configure the AI's risk assessment parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>High Risk Threshold ({riskThresholds.high}%)</Label>
              <Slider
                value={[riskThresholds.high]}
                onValueChange={([value]) => setRiskThresholds(prev => ({ ...prev, high: value }))}
                max={100}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Medium Risk Threshold ({riskThresholds.medium}%)</Label>
              <Slider
                value={[riskThresholds.medium]}
                onValueChange={([value]) => setRiskThresholds(prev => ({ ...prev, medium: value }))}
                max={100}
                step={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Model Management</CardTitle>
          <CardDescription>
            Control the AI model's training and deployment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button className="w-full">
              <Brain className="w-4 h-4 mr-2" />
              Retrain Model
            </Button>
            <Button variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Update Parameters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}